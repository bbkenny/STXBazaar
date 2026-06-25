;; Mock Yield Strategy implementing yield-strategy-trait
;; Local test mock only -- not for mainnet use.
(impl-trait .yield-strategy-trait.yield-strategy-trait)

(define-public (deposit (amount uint))
    (begin
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (ok true)
    )
)

;; Capture the caller (yield-adapter) before switching to as-contract context,
;; so we transfer from THIS contract back to the caller, not to ourselves.
(define-public (withdraw (amount uint))
    (let ((caller tx-sender))
        (try! (as-contract (stx-transfer? amount tx-sender caller)))
        (ok true)
    )
)
