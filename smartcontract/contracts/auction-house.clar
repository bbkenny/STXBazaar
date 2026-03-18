;; =============================================
;; STX BAZAAR -- Auction House Contract
;; =============================================
;; A fully barrier-free auction system on Bitcoin L2.
;; Any wallet can create auctions, place bids, end auctions, and withdraw funds.
;; Auto-refunds previous bidders on outbid. No admin gates. No minimums.
;; Clarity 4 | Nakamoto | Epoch 3.3

;; -----------------------------------------------
;; Constants
;; -----------------------------------------------
(define-constant ERR-AUCTION-NOT-FOUND (err u100))
(define-constant ERR-NOT-SELLER (err u101))
(define-constant ERR-AUCTION-NOT-ACTIVE (err u102))
(define-constant ERR-AUCTION-STILL-ACTIVE (err u103))
(define-constant ERR-BID-TOO-LOW (err u104))
(define-constant ERR-INVALID-DURATION (err u105))
(define-constant ERR-EMPTY-TITLE (err u106))
(define-constant ERR-SELF-BID (err u107))
(define-constant ERR-NO-BIDS (err u108))
(define-constant ERR-NO-FUNDS-TO-WITHDRAW (err u109))
(define-constant ERR-ALREADY-WITHDRAWN (err u110))
(define-constant ERR-EMPTY-DESCRIPTION (err u112))

;; Status
(define-constant STATUS-ACTIVE u0)
(define-constant STATUS-ENDED u1)
(define-constant STATUS-CANCELLED u2)

;; -----------------------------------------------
;; Data Variables
;; -----------------------------------------------
(define-constant CONTRACT-ADDRESS .auction-house)
(define-data-var auction-counter uint u0)
(define-data-var total-volume uint u0)
(define-data-var total-auctions-completed uint u0)

;; -----------------------------------------------
;; Maps
;; -----------------------------------------------
(define-map auctions uint
  {
    seller: principal,
    title: (string-ascii 64),
    description: (string-ascii 256),
    starting-price: uint,
    current-bid: uint,
    current-bidder: (optional principal),
    start-block: uint,
    end-block: uint,
    status: uint,
    bid-count: uint,
    funds-withdrawn: bool,
    category: (string-ascii 32)
  }
)

;; Track bid history per auction per bidder
(define-map bid-history { auction-id: uint, bidder: principal } uint)

;; Track total bids placed by a wallet globally
(define-map bidder-stats principal
  {
    total-bids: uint,
    total-spent: uint,
    auctions-won: uint
  }
)

;; Track seller stats
(define-map seller-stats principal
  {
    total-auctions: uint,
    total-revenue: uint,
    auctions-completed: uint
  }
)

;; -----------------------------------------------
;; Public Functions -- ALL BARRIER-FREE
;; -----------------------------------------------

;; Create a new auction -- any wallet can call
;; starting-price: minimum bid in microSTX (even u1 is valid)
(define-public (create-auction
    (title (string-ascii 64))
    (description (string-ascii 256))
    (starting-price uint)
    (duration-blocks uint)
    (category (string-ascii 32))
  )
  (let (
    (auction-id (+ (var-get auction-counter) u1))
    (end-block (+ stacks-block-height duration-blocks))
  )
    (asserts! (> (len title) u0) ERR-EMPTY-TITLE)
    (asserts! (> (len description) u0) ERR-EMPTY-DESCRIPTION)
    (asserts! (> starting-price u0) (err u113))
    (asserts! (> duration-blocks u0) ERR-INVALID-DURATION)

    (map-set auctions auction-id {
      seller: tx-sender,
      title: title,
      description: description,
      starting-price: starting-price,
      current-bid: u0,
      current-bidder: none,
      start-block: stacks-block-height,
      end-block: end-block,
      status: STATUS-ACTIVE,
      bid-count: u0,
      funds-withdrawn: false,
      category: category
    })

    ;; Update seller stats
    (let ((stats (default-to { total-auctions: u0, total-revenue: u0, auctions-completed: u0 }
                    (map-get? seller-stats tx-sender))))
      (map-set seller-stats tx-sender (merge stats {
        total-auctions: (+ (get total-auctions stats) u1)
      }))
    )

    (var-set auction-counter auction-id)
    (print {
      event: "auction-created",
      auction-id: auction-id,
      seller: tx-sender,
      starting-price: starting-price,
      end-block: end-block,
      category: category
    })
    (ok auction-id)
  )
)

;; Place a bid -- any wallet can call (except seller)
;; Automatically refunds previous bidder
(define-public (place-bid (auction-id uint) (bid-amount uint))
  (let (
    (auction (unwrap! (map-get? auctions auction-id) ERR-AUCTION-NOT-FOUND))
    (min-bid (if (> (get current-bid auction) u0)
                 (+ (get current-bid auction) u1)
                 (get starting-price auction)))
  )
    (asserts! (is-eq (get status auction) STATUS-ACTIVE) ERR-AUCTION-NOT-ACTIVE)
    (asserts! (< stacks-block-height (get end-block auction)) ERR-AUCTION-STILL-ACTIVE)
    (asserts! (>= bid-amount min-bid) ERR-BID-TOO-LOW)
    (asserts! (not (is-eq tx-sender (get seller auction))) ERR-SELF-BID)

    ;; Transfer bid from bidder to contract
    (try! (stx-transfer? bid-amount tx-sender CONTRACT-ADDRESS))

    ;; Auto-refund previous bidder
    (match (get current-bidder auction)
      prev-bidder (try! (stx-transfer? (get current-bid auction) CONTRACT-ADDRESS prev-bidder))
      true
    )

    ;; Update auction state
    (map-set auctions auction-id (merge auction {
      current-bid: bid-amount,
      current-bidder: (some tx-sender),
      bid-count: (+ (get bid-count auction) u1)
    }))

    ;; Track bidder history
    (map-set bid-history { auction-id: auction-id, bidder: tx-sender } bid-amount)

    ;; Update bidder global stats
    (let ((stats (default-to { total-bids: u0, total-spent: u0, auctions-won: u0 }
                    (map-get? bidder-stats tx-sender))))
      (map-set bidder-stats tx-sender (merge stats {
        total-bids: (+ (get total-bids stats) u1),
        total-spent: (+ (get total-spent stats) bid-amount)
      }))
    )

    (var-set total-volume (+ (var-get total-volume) bid-amount))
    (print {
      event: "bid-placed",
      auction-id: auction-id,
      bidder: tx-sender,
      amount: bid-amount,
      bid-number: (+ (get bid-count auction) u1)
    })
    (ok true)
  )
)

;; End an auction after its duration expires -- any wallet can trigger
(define-public (end-auction (auction-id uint))
  (let (
    (auction (unwrap! (map-get? auctions auction-id) ERR-AUCTION-NOT-FOUND))
  )
    (asserts! (is-eq (get status auction) STATUS-ACTIVE) ERR-AUCTION-NOT-ACTIVE)
    (asserts! (>= stacks-block-height (get end-block auction)) ERR-AUCTION-STILL-ACTIVE)

    (map-set auctions auction-id (merge auction { status: STATUS-ENDED }))
    (var-set total-auctions-completed (+ (var-get total-auctions-completed) u1))

    ;; Update winner stats if there was a winning bidder
    (match (get current-bidder auction)
      winner (let ((stats (default-to { total-bids: u0, total-spent: u0, auctions-won: u0 }
                    (map-get? bidder-stats winner))))
        (map-set bidder-stats winner (merge stats {
          auctions-won: (+ (get auctions-won stats) u1)
        }))
      )
      true
    )

    (print {
      event: "auction-ended",
      auction-id: auction-id,
      winner: (get current-bidder auction),
      final-price: (get current-bid auction),
      total-bids: (get bid-count auction)
    })
    (ok true)
  )
)

;; Withdraw funds after auction ends -- seller receives winning bid
(define-public (withdraw-funds (auction-id uint))
  (let (
    (auction (unwrap! (map-get? auctions auction-id) ERR-AUCTION-NOT-FOUND))
    (amount (get current-bid auction))
  )
    (asserts! (is-eq (get status auction) STATUS-ENDED) ERR-AUCTION-NOT-ACTIVE)
    (asserts! (> amount u0) ERR-NO-FUNDS-TO-WITHDRAW)
    (asserts! (not (get funds-withdrawn auction)) ERR-ALREADY-WITHDRAWN)

    (map-set auctions auction-id (merge auction { funds-withdrawn: true }))
    (try! (stx-transfer? amount CONTRACT-ADDRESS (get seller auction)))

    ;; Update seller revenue stats
    (let ((stats (default-to { total-auctions: u0, total-revenue: u0, auctions-completed: u0 }
                    (map-get? seller-stats (get seller auction)))))
      (map-set seller-stats (get seller auction) (merge stats {
        total-revenue: (+ (get total-revenue stats) amount),
        auctions-completed: (+ (get auctions-completed stats) u1)
      }))
    )

    (print {
      event: "funds-withdrawn",
      auction-id: auction-id,
      seller: (get seller auction),
      amount: amount
    })
    (ok amount)
  )
)

;; Cancel an auction -- seller only, only if no bids yet
(define-public (cancel-auction (auction-id uint))
  (let (
    (auction (unwrap! (map-get? auctions auction-id) ERR-AUCTION-NOT-FOUND))
  )
    (asserts! (is-eq tx-sender (get seller auction)) ERR-NOT-SELLER)
    (asserts! (is-eq (get status auction) STATUS-ACTIVE) ERR-AUCTION-NOT-ACTIVE)
    (asserts! (is-eq (get bid-count auction) u0) ERR-NO-BIDS)

    (map-set auctions auction-id (merge auction { status: STATUS-CANCELLED }))
    (print {
      event: "auction-cancelled",
      auction-id: auction-id,
      seller: tx-sender
    })
    (ok true)
  )
)

;; -----------------------------------------------
;; Read-Only Functions
;; -----------------------------------------------
(define-read-only (get-auction (auction-id uint))
  (map-get? auctions auction-id)
)

(define-read-only (get-bid-for (auction-id uint) (bidder principal))
  (default-to u0 (map-get? bid-history { auction-id: auction-id, bidder: bidder }))
)

(define-read-only (get-bidder-stats-info (bidder principal))
  (default-to { total-bids: u0, total-spent: u0, auctions-won: u0 }
    (map-get? bidder-stats bidder))
)

(define-read-only (get-seller-stats-info (seller principal))
  (default-to { total-auctions: u0, total-revenue: u0, auctions-completed: u0 }
    (map-get? seller-stats seller))
)

(define-read-only (get-total-auctions)
  (var-get auction-counter)
)

(define-read-only (get-marketplace-stats)
  {
    total-auctions: (var-get auction-counter),
    auctions-completed: (var-get total-auctions-completed),
    total-volume: (var-get total-volume)
  }
)

;; Clarity 4: to-ascii? for human-readable auction info
(define-read-only (get-auction-summary (auction-id uint))
  (match (map-get? auctions auction-id)
    auction (let (
      (bid-ascii (match (to-ascii? (get current-bid auction)) ok-val ok-val err "0"))
      (bid-count-ascii (match (to-ascii? (get bid-count auction)) ok-val ok-val err "0"))
      (status-str (if (is-eq (get status auction) STATUS-ACTIVE) "ACTIVE"
        (if (is-eq (get status auction) STATUS-ENDED) "ENDED"
        "CANCELLED")))
    )
      (ok {
        title: (get title auction),
        category: (get category auction),
        current-bid: bid-ascii,
        bid-count: bid-count-ascii,
        status: status-str,
        funds-withdrawn: (get funds-withdrawn auction)
      })
    )
    ERR-AUCTION-NOT-FOUND
  )
)

;; Initialize contract principal
