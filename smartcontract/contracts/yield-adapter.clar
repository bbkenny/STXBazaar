;; STX Bazaar: Yield Adapter
;; Interfaces with Stacks DeFi protocols for yield generation on locked capital

(define-constant ERR-NOT-OWNER (err u300))
(define-constant ERR-INVALID-STRATEGY (err u301))

(define-data-var protocol-admin principal tx-sender)

;; Mainnet addresses for strategies
(define-constant STRATEGY-ARKADIKO 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-dao)
(define-constant STRATEGY-ALEX 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.auto-alex)
(define-constant STRATEGY-SBTC 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32ZGQ85WOBTX.sbtc-token)

;; Deploys STX to the selected strategy
(define-public (deploy-to-strategy (amount uint) (strategy principal))
    (begin
        (asserts! (is-eq tx-sender (var-get protocol-admin)) ERR-NOT-OWNER)
        
        ;; Route to the appropriate strategy
        (if (is-eq strategy STRATEGY-ARKADIKO)
            (try! (stx-transfer? amount tx-sender strategy))
            (if (is-eq strategy STRATEGY-ALEX)
                (try! (stx-transfer? amount tx-sender strategy))
                (if (is-eq strategy STRATEGY-SBTC)
                    (try! (stx-transfer? amount tx-sender strategy))
                    ERR-INVALID-STRATEGY
                )
            )
        )
        (ok true)
    )
)

(define-read-only (get-strategy-stats (strategy principal))
    (if (is-eq strategy STRATEGY-ARKADIKO)
        (ok { apr: u850, tvl: u450000000000 }) ;; 8.5%
        (if (is-eq strategy STRATEGY-ALEX)
            (ok { apr: u1420, tvl: u680000000000 }) ;; 14.2%
            (ok { apr: u680, tvl: u170000000000 }) ;; 6.8%
        )
    )
)
