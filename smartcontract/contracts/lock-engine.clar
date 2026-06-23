;; STX Bazaar: Lock Engine
;; Logic for gradual release and streaming schedules

(define-constant ERR-INVALID-SCHEDULE (err u200))

;; Schedule Logic
;; Returns the amount currently unlockable based on a linear stream
(define-public (calculate-unlocked-amount 
    (total-amount uint) 
    (start-block uint) 
    (end-block uint) 
    (current-block uint))
    
    (if (>= current-block end-block)
        (ok total-amount)
        (if (<= current-block start-block)
            (ok u0)
            (ok (/ (* total-amount (- current-block start-block)) (- end-block start-block)))
        )
    )
)

;; Helper to validate time parameters
(define-read-only (is-valid-range (start uint) (end uint))
    (< start end)
)
