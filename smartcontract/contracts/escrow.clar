;; =============================================
;; STX BAZAAR — Escrow Contract
;; =============================================
;; A fully barrier-free escrow system on Bitcoin L2.
;; Any wallet can create escrows, complete deals, raise disputes, and resolve them.
;; Supports deadline-based auto-refund and community arbitration.
;; No admin gates. No minimum amounts. Trustless P2P commerce.
;; Clarity 4 | Nakamoto | Epoch 3.3

;; -----------------------------------------------
;; Constants
;; -----------------------------------------------
(define-constant CONTRACT-ADDR (as-contract tx-sender))
(define-constant ERR-ESCROW-NOT-FOUND (err u200))
(define-constant ERR-NOT-BUYER (err u201))
(define-constant ERR-NOT-SELLER (err u202))
(define-constant ERR-NOT-PARTY (err u203))
(define-constant ERR-NOT-ARBITRATOR (err u204))
(define-constant ERR-ESCROW-NOT-ACTIVE (err u205))
(define-constant ERR-ALREADY-DISPUTED (err u206))
(define-constant ERR-NOT-DISPUTED (err u207))
(define-constant ERR-SAME-PARTY (err u208))
(define-constant ERR-INVALID-AMOUNT (err u209))
(define-constant ERR-INVALID-DURATION (err u210))
(define-constant ERR-DEADLINE-NOT-PASSED (err u211))
(define-constant ERR-ALREADY-RESOLVED (err u212))
(define-constant ERR-SELF-ARBITRATE (err u213))
(define-constant ERR-TRANSFER-FAILED (err u214))

;; Status
(define-constant STATUS-ACTIVE u0)
(define-constant STATUS-COMPLETED u1)
(define-constant STATUS-DISPUTED u2)
(define-constant STATUS-REFUNDED u3)
(define-constant STATUS-EXPIRED u4)

;; -----------------------------------------------
;; Data Variables
;; -----------------------------------------------
(define-data-var escrow-counter uint u0)
(define-data-var total-volume uint u0)
(define-data-var total-escrows-completed uint u0)
(define-data-var total-disputes uint u0)

;; -----------------------------------------------
;; Maps
;; -----------------------------------------------
(define-map escrows uint
  {
    buyer: principal,
    seller: principal,
    amount: uint,
    status: uint,
    deadline-block: uint,
    created-at: uint,
    description: (string-ascii 256),
    arbitrator: (optional principal),
    dispute-reason: (optional (string-ascii 256)),
    resolved-at: (optional uint)
  }
)

;; Track arbitrator reputation
(define-map arbitrator-stats principal
  {
    cases-resolved: uint,
    buyer-favored: uint,
    seller-favored: uint
  }
)

;; Track user escrow history
(define-map user-escrow-count principal uint)

;; -----------------------------------------------
;; Public Functions — ALL BARRIER-FREE
;; -----------------------------------------------

;; Create an escrow — any buyer can call
;; Locks STX in the contract until deal is completed or disputed
;; amount: in microSTX (even u1 is valid)
(define-public (create-escrow
    (seller principal)
    (amount uint)
    (duration-blocks uint)
    (description (string-ascii 256))
  )
  (let (
    (escrow-id (+ (var-get escrow-counter) u1))
    (deadline (+ stacks-block-height duration-blocks))
  )
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq seller tx-sender)) ERR-SAME-PARTY)
    (asserts! (> duration-blocks u0) ERR-INVALID-DURATION)
    (asserts! (> (len description) u0) (err u220))

    ;; Lock funds in contract
    (try! (stx-transfer? amount tx-sender CONTRACT-ADDR))

    (map-set escrows escrow-id {
      buyer: tx-sender,
      seller: seller,
      amount: amount,
      status: STATUS-ACTIVE,
      deadline-block: deadline,
      created-at: stacks-block-height,
      description: description,
      arbitrator: none,
      dispute-reason: none,
      resolved-at: none
    })

    ;; Track user escrow count
    (let ((count (default-to u0 (map-get? user-escrow-count tx-sender))))
      (map-set user-escrow-count tx-sender (+ count u1))
    )

    (var-set escrow-counter escrow-id)
    (var-set total-volume (+ (var-get total-volume) amount))

    (print {
      event: "escrow-created",
      escrow-id: escrow-id,
      buyer: tx-sender,
      seller: seller,
      amount: amount,
      deadline-block: deadline
    })
    (ok escrow-id)
  )
)

;; Complete escrow — buyer confirms delivery, releases funds to seller
(define-public (complete-escrow (escrow-id uint))
  (let (
    (escrow (unwrap! (map-get? escrows escrow-id) ERR-ESCROW-NOT-FOUND))
  )
    (asserts! (is-eq (get buyer escrow) tx-sender) ERR-NOT-BUYER)
    (asserts! (is-eq (get status escrow) STATUS-ACTIVE) ERR-ESCROW-NOT-ACTIVE)

    (map-set escrows escrow-id (merge escrow {
      status: STATUS-COMPLETED,
      resolved-at: (some stacks-block-height)
    }))

    ;; Release funds to seller
    (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get seller escrow))))

    (var-set total-escrows-completed (+ (var-get total-escrows-completed) u1))
    (print {
      event: "escrow-completed",
      escrow-id: escrow-id,
      buyer: tx-sender,
      seller: (get seller escrow),
      amount: (get amount escrow)
    })
    (ok true)
  )
)

;; Raise a dispute — either buyer or seller can call
(define-public (raise-dispute (escrow-id uint) (reason (string-ascii 256)))
  (let (
    (escrow (unwrap! (map-get? escrows escrow-id) ERR-ESCROW-NOT-FOUND))
  )
    (asserts! (or (is-eq (get buyer escrow) tx-sender) (is-eq (get seller escrow) tx-sender)) ERR-NOT-PARTY)
    (asserts! (is-eq (get status escrow) STATUS-ACTIVE) ERR-ESCROW-NOT-ACTIVE)

    (map-set escrows escrow-id (merge escrow {
      status: STATUS-DISPUTED,
      dispute-reason: (some reason)
    }))

    (var-set total-disputes (+ (var-get total-disputes) u1))
    (print {
      event: "dispute-raised",
      escrow-id: escrow-id,
      raised-by: tx-sender,
      reason: reason
    })
    (ok true)
  )
)

;; Nominate an arbitrator — either party can nominate (must not be buyer or seller)
(define-public (nominate-arbitrator (escrow-id uint) (arbitrator principal))
  (let (
    (escrow (unwrap! (map-get? escrows escrow-id) ERR-ESCROW-NOT-FOUND))
  )
    (asserts! (or (is-eq (get buyer escrow) tx-sender) (is-eq (get seller escrow) tx-sender)) ERR-NOT-PARTY)
    (asserts! (is-eq (get status escrow) STATUS-DISPUTED) ERR-NOT-DISPUTED)
    (asserts! (not (is-eq arbitrator (get buyer escrow))) ERR-SELF-ARBITRATE)
    (asserts! (not (is-eq arbitrator (get seller escrow))) ERR-SELF-ARBITRATE)

    (map-set escrows escrow-id (merge escrow {
      arbitrator: (some arbitrator)
    }))

    (print {
      event: "arbitrator-nominated",
      escrow-id: escrow-id,
      arbitrator: arbitrator,
      nominated-by: tx-sender
    })
    (ok true)
  )
)

;; Resolve dispute — arbitrator decides who gets the funds
(define-public (resolve-dispute (escrow-id uint) (buyer-wins bool))
  (let (
    (escrow (unwrap! (map-get? escrows escrow-id) ERR-ESCROW-NOT-FOUND))
  )
    (asserts! (is-eq (get status escrow) STATUS-DISPUTED) ERR-NOT-DISPUTED)
    (asserts! (is-eq (some tx-sender) (get arbitrator escrow)) ERR-NOT-ARBITRATOR)

    (if buyer-wins
      (begin
        (map-set escrows escrow-id (merge escrow {
          status: STATUS-REFUNDED,
          resolved-at: (some stacks-block-height)
        }))
        (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get buyer escrow))))
      )
      (begin
        (map-set escrows escrow-id (merge escrow {
          status: STATUS-COMPLETED,
          resolved-at: (some stacks-block-height)
        }))
        (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get seller escrow))))
      )
    )

    ;; Update arbitrator stats
    (let ((stats (default-to { cases-resolved: u0, buyer-favored: u0, seller-favored: u0 }
                    (map-get? arbitrator-stats tx-sender))))
      (map-set arbitrator-stats tx-sender (merge stats {
        cases-resolved: (+ (get cases-resolved stats) u1),
        buyer-favored: (if buyer-wins (+ (get buyer-favored stats) u1) (get buyer-favored stats)),
        seller-favored: (if buyer-wins (get seller-favored stats) (+ (get seller-favored stats) u1))
      }))
    )

    (print {
      event: "dispute-resolved",
      escrow-id: escrow-id,
      arbitrator: tx-sender,
      buyer-wins: buyer-wins,
      amount: (get amount escrow)
    })
    (ok true)
  )
)

;; Claim refund after deadline — buyer can reclaim if deadline passed and still active
(define-public (claim-expired-refund (escrow-id uint))
  (let (
    (escrow (unwrap! (map-get? escrows escrow-id) ERR-ESCROW-NOT-FOUND))
  )
    (asserts! (is-eq (get buyer escrow) tx-sender) ERR-NOT-BUYER)
    (asserts! (is-eq (get status escrow) STATUS-ACTIVE) ERR-ESCROW-NOT-ACTIVE)
    (asserts! (>= stacks-block-height (get deadline-block escrow)) ERR-DEADLINE-NOT-PASSED)

    (map-set escrows escrow-id (merge escrow {
      status: STATUS-EXPIRED,
      resolved-at: (some stacks-block-height)
    }))

    (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get buyer escrow))))

    (print {
      event: "escrow-expired-refund",
      escrow-id: escrow-id,
      buyer: tx-sender,
      amount: (get amount escrow)
    })
    (ok (get amount escrow))
  )
)

;; -----------------------------------------------
;; Read-Only Functions
;; -----------------------------------------------
(define-read-only (get-escrow (escrow-id uint))
  (map-get? escrows escrow-id)
)

(define-read-only (get-arbitrator-stats-info (arbitrator principal))
  (default-to { cases-resolved: u0, buyer-favored: u0, seller-favored: u0 }
    (map-get? arbitrator-stats arbitrator))
)

(define-read-only (get-user-escrow-count (user principal))
  (default-to u0 (map-get? user-escrow-count user))
)

(define-read-only (get-total-escrows)
  (var-get escrow-counter)
)

(define-read-only (get-escrow-platform-stats)
  {
    total-escrows: (var-get escrow-counter),
    total-completed: (var-get total-escrows-completed),
    total-disputes: (var-get total-disputes),
    total-volume: (var-get total-volume)
  }
)

;; Clarity 4: to-ascii? for human-readable escrow info
(define-read-only (get-escrow-summary (escrow-id uint))
  (match (map-get? escrows escrow-id)
    escrow (let (
      (amount-ascii (match (to-ascii? (get amount escrow)) ok-val ok-val err "0"))
      (status-str (if (is-eq (get status escrow) STATUS-ACTIVE) "ACTIVE"
        (if (is-eq (get status escrow) STATUS-COMPLETED) "COMPLETED"
        (if (is-eq (get status escrow) STATUS-DISPUTED) "DISPUTED"
        (if (is-eq (get status escrow) STATUS-REFUNDED) "REFUNDED"
        "EXPIRED")))))
    )
      (ok {
        buyer: (get buyer escrow),
        seller: (get seller escrow),
        amount: amount-ascii,
        status: status-str,
        description: (get description escrow)
      })
    )
    ERR-ESCROW-NOT-FOUND
  )
)
