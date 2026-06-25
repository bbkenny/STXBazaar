;; STX Bazaar: Vault Contract
;; Implements non-custodial Bitcoin-native vaults with time-lock logic

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-EXISTS (err u101))
(define-constant ERR-VAULT-NOT-FOUND (err u102))
(define-constant ERR-STILL-LOCKED (err u103))
(define-constant ERR-INSUFFICIENT-FUNDS (err u104))
(define-constant ERR-INVALID-ENGINE (err u105))
(define-constant ERR-UNAUTHORIZED (err u100))

(use-trait lock-engine-trait .lock-engine-trait.lock-engine-trait)
(use-trait yield-strategy-trait .yield-strategy-trait.yield-strategy-trait)

(define-data-var authorized-lock-engine principal .stxbazaar-lockengine-beta)
(define-data-var protocol-fee uint u0) ;; base points, e.g. 100 = 1%
(define-data-var protocol-treasury principal tx-sender)

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

(define-public (set-protocol-fee (new-fee uint))
    (begin
        (asserts! (is-admin tx-sender) ERR-UNAUTHORIZED)
        (asserts! (<= new-fee u1000) (err u400)) ;; Max 10%
        (var-set protocol-fee new-fee)
        (ok true)
    )
)

(define-public (set-protocol-treasury (new-treasury principal))
    (begin
        (asserts! (is-admin tx-sender) ERR-UNAUTHORIZED)
        (var-set protocol-treasury new-treasury)
        (ok true)
    )
)

;; Vault State
(define-map vaults 
    uint 
    {
        owner: principal,
        balance: uint,
        withdrawn: uint,
        lock-period: uint, ;; Block height or duration
        created-at: uint,
        is-active: bool,
        yield-strategy: (optional principal)
    }
)

(define-data-var vault-nonce uint u0)

;; Public Functions

(define-public (create-vault (amount uint) (lock-period uint))
    (let
        (
            (vault-id (var-get vault-nonce))
            (new-vault {
                owner: tx-sender,
                balance: amount,
                withdrawn: u0,
                lock-period: lock-period,
                created-at: burn-block-height,
                is-active: true,
                yield-strategy: none
            })
        )
        ;; Transfer STX to contract
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        
        ;; Save vault
        (map-set vaults vault-id new-vault)
        
        ;; Increment nonce
        (var-set vault-nonce (+ vault-id u1))
        
        (ok vault-id)
    )
)

(define-public (withdraw (vault-id uint) (engine <lock-engine-trait>) (strategy <yield-strategy-trait>))
    (let
        (
            (vault (unwrap! (map-get? vaults vault-id) ERR-VAULT-NOT-FOUND))
            (unlocked (unwrap-panic (contract-call? engine calculate-unlocked-amount (get balance vault) (get created-at vault) (get lock-period vault) burn-block-height)))
            (available-to-withdraw (- unlocked (get withdrawn vault)))
            (strategy-addr (contract-of strategy))
        )
        ;; Check valid engine
        (asserts! (is-eq (contract-of engine) (var-get authorized-lock-engine)) ERR-INVALID-ENGINE)
        ;; Check owner
        (asserts! (is-eq (get owner vault) tx-sender) ERR-NOT-AUTHORIZED)
        ;; Check active status
        (asserts! (get is-active vault) ERR-INSUFFICIENT-FUNDS)
        ;; Ensure there is an unlocked amount ready to withdraw
        (asserts! (> available-to-withdraw u0) ERR-STILL-LOCKED)
        
        ;; If vault has an active yield strategy, withdraw from it first
        (match (get yield-strategy vault)
            active-strategy
            (begin
                ;; Ensure the passed strategy contract reference matches the stored one
                (asserts! (is-eq strategy-addr active-strategy) ERR-NOT-AUTHORIZED)
                ;; Call yield-adapter to withdraw STX back to this vault
                (try! (as-contract (contract-call? .stxbazaar-yieldadapter-beta withdraw-from-strategy available-to-withdraw strategy)))
                true
            )
            true
        )
        
        ;; Update state
        (map-set vaults vault-id (merge vault { 
            withdrawn: (+ (get withdrawn vault) available-to-withdraw),
            is-active: (not (is-eq (+ (get withdrawn vault) available-to-withdraw) (get balance vault)))
        }))
        
        ;; Transfer funds back
        (as-contract (stx-transfer? available-to-withdraw (as-contract tx-sender) (get owner vault)))
    )
)

(define-public (set-yield-strategy (vault-id uint) (strategy <yield-strategy-trait>))
    (let
        (
            (vault (unwrap! (map-get? vaults vault-id) ERR-VAULT-NOT-FOUND))
            (strategy-addr (contract-of strategy))
        )
        ;; Check owner
        (asserts! (is-eq (get owner vault) tx-sender) ERR-NOT-AUTHORIZED)
        ;; Check active status
        (asserts! (get is-active vault) ERR-INSUFFICIENT-FUNDS)
        ;; Ensure no strategy is already set
        (asserts! (is-none (get yield-strategy vault)) ERR-ALREADY-EXISTS)
        
        ;; Update vault with new strategy
        (map-set vaults vault-id (merge vault { yield-strategy: (some strategy-addr) }))
        
        ;; Deploy vault's current balance to the yield-adapter/strategy
        (try! (as-contract (contract-call? .stxbazaar-yieldadapter-beta deploy-to-strategy (- (get balance vault) (get withdrawn vault)) strategy)))
        
        (ok true)
    )
)

(define-public (remove-yield-strategy (vault-id uint) (strategy <yield-strategy-trait>))
    (let
        (
            (vault (unwrap! (map-get? vaults vault-id) ERR-VAULT-NOT-FOUND))
            (strategy-addr (contract-of strategy))
        )
        ;; Check owner
        (asserts! (is-eq (get owner vault) tx-sender) ERR-NOT-AUTHORIZED)
        ;; Ensure strategy matches
        (asserts! (is-eq (some strategy-addr) (get yield-strategy vault)) ERR-NOT-AUTHORIZED)
        
        ;; Update vault
        (map-set vaults vault-id (merge vault { yield-strategy: none }))
        
        ;; Withdraw all funds back to vault
        (try! (as-contract (contract-call? .stxbazaar-yieldadapter-beta withdraw-from-strategy (- (get balance vault) (get withdrawn vault)) strategy)))
        
        (ok true)
    )
)

;; Read-only Functions

(define-read-only (get-vault (vault-id uint))
    (map-get? vaults vault-id)
)

(define-read-only (get-total-vaults)
    (var-get vault-nonce)
)
