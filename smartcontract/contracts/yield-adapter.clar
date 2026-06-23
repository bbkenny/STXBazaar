;; STX Bazaar: Yield Adapter
;; Interfaces with Stacks DeFi protocols for yield generation on locked capital

(define-constant ERR-NOT-OWNER (err u300))
(define-constant ERR-INVALID-STRATEGY (err u301))

(define-constant ERR-UNAUTHORIZED (err u100))

;; ===== Multi-Admin 70% Quorum =====
(define-map admins principal bool)
(define-data-var admin-count uint u1)

;; Initialize deployer as admin
(map-set admins tx-sender true)

(define-read-only (is-admin (caller principal))
    (default-to false (map-get? admins caller))
)

(define-read-only (get-required-approvals)
    (let ((count (var-get admin-count)))
        (if (is-eq count u1)
            u1
            (/ (+ (* count u70) u99) u100)
        )
    )
)

(define-map admin-proposals
    uint
    {
        candidate: principal,
        is-add: bool,
        approvals: uint,
        executed: bool
    }
)
(define-map admin-has-approved { proposal-id: uint, approver: principal } bool)
(define-data-var next-admin-proposal-id uint u0)

(define-private (execute-admin-proposal (proposal-id uint))
    (let (
        (proposal (unwrap-panic (map-get? admin-proposals proposal-id)))
        (required-approvals (get-required-approvals))
        (candidate (get candidate proposal))
    )
        (if (>= (get approvals proposal) required-approvals)
            (begin
                (map-set admin-proposals proposal-id (merge proposal { executed: true }))
                (if (get is-add proposal)
                    (begin
                        (map-set admins candidate true)
                        (var-set admin-count (+ (var-get admin-count) u1))
                    )
                    (begin
                        (map-set admins candidate false)
                        (var-set admin-count (- (var-get admin-count) u1))
                    )
                )
                true
            )
            false
        )
    )
)

(define-public (propose-admin-change (candidate principal) (is-add bool))
    (begin
        (asserts! (is-admin tx-sender) ERR-UNAUTHORIZED)
        (let ((proposal-id (var-get next-admin-proposal-id)))
            (map-set admin-proposals proposal-id {
                candidate: candidate,
                is-add: is-add,
                approvals: u1,
                executed: false
            })
            (map-set admin-has-approved { proposal-id: proposal-id, approver: tx-sender } true)
            (var-set next-admin-proposal-id (+ proposal-id u1))
            (execute-admin-proposal proposal-id)
            (ok proposal-id)
        )
    )
)

(define-public (approve-admin-change (proposal-id uint))
    (let (
        (proposal (unwrap! (map-get? admin-proposals proposal-id) (err u404)))
    )
        (asserts! (is-admin tx-sender) ERR-UNAUTHORIZED)
        (asserts! (not (get executed proposal)) (err u400))
        (asserts! (not (default-to false (map-get? admin-has-approved { proposal-id: proposal-id, approver: tx-sender }))) (err u409))

        (map-set admin-has-approved { proposal-id: proposal-id, approver: tx-sender } true)
        (map-set admin-proposals proposal-id (merge proposal { approvals: (+ (get approvals proposal) u1) }))
        
        (execute-admin-proposal proposal-id)
        (ok true)
    )
)

;; Map of approved strategies and their stats
;; Allows admin to add/remove strategies without redeploying
(define-map approved-strategies 
    principal 
    {
        active: bool,
        apr: uint,
        tvl: uint
    }
)

;; Initialize default strategies on deployment
(begin
    (map-set approved-strategies 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-dao { active: true, apr: u850, tvl: u450000000000 })
    (map-set approved-strategies 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.auto-alex { active: true, apr: u1420, tvl: u680000000000 })
    (map-set approved-strategies 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.sbtc-token { active: true, apr: u680, tvl: u170000000000 })
)

;; Deploys STX to the selected strategy
(define-public (deploy-to-strategy (amount uint) (strategy principal))
    (let
        (
            (strategy-data (unwrap! (map-get? approved-strategies strategy) ERR-INVALID-STRATEGY))
        )
        (asserts! (is-admin tx-sender) ERR-NOT-OWNER)
        
        ;; Route to the appropriate strategy
        (asserts! (get active strategy-data) ERR-INVALID-STRATEGY)
        
        (try! (stx-transfer? amount tx-sender strategy))
        (ok true)
    )
)

;; Admin: Update or add a strategy and its stats
(define-public (set-strategy (strategy principal) (active bool) (apr uint) (tvl uint))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-OWNER)
        (map-set approved-strategies strategy { active: active, apr: apr, tvl: tvl })
        (ok true)
    )
)

;; Read-only: Get strategy stats dynamically
(define-read-only (get-strategy-stats (strategy principal))
    (map-get? approved-strategies strategy)
)
