;; STX Bazaar: Yield Adapter
;; Interfaces with Stacks DeFi protocols for yield generation on locked capital

(define-constant ERR-NOT-OWNER (err u300))
(define-constant ERR-INVALID-STRATEGY (err u301))

(define-data-var protocol-admin principal tx-sender)

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
        (asserts! (is-eq tx-sender (var-get protocol-admin)) ERR-NOT-OWNER)
        
        ;; Route to the appropriate strategy
        (asserts! (get active strategy-data) ERR-INVALID-STRATEGY)
        
        (try! (stx-transfer? amount tx-sender strategy))
        (ok true)
    )
)

;; Admin: Update or add a strategy and its stats
(define-public (set-strategy (strategy principal) (active bool) (apr uint) (tvl uint))
    (begin
        (asserts! (is-eq tx-sender (var-get protocol-admin)) ERR-NOT-OWNER)
        (map-set approved-strategies strategy { active: active, apr: apr, tvl: tvl })
        (ok true)
    )
)

;; Admin: Transfer admin rights to a new principal
(define-public (transfer-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender (var-get protocol-admin)) ERR-NOT-OWNER)
        (var-set protocol-admin new-admin)
        (ok true)
    )
)

;; Read-only: Get strategy stats dynamically
(define-read-only (get-strategy-stats (strategy principal))
    (map-get? approved-strategies strategy)
)
