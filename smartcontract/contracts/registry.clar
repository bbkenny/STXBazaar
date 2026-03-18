;; =============================================
;; STX BAZAAR -- Registry Contract
;; =============================================
;; A fully barrier-free name and identity registry on Bitcoin L2.
;; Any wallet can register names, update metadata, transfer ownership,
;; and verify other registrations. No admin gates. No fees.
;; Designed for seller/store identity within the STX Bazaar marketplace.
;; Clarity 4 | Nakamoto | Epoch 3.3

;; -----------------------------------------------
;; Constants
;; -----------------------------------------------
(define-constant ERR-NAME-TAKEN (err u300))
(define-constant ERR-NAME-NOT-FOUND (err u301))
(define-constant ERR-NOT-OWNER (err u302))
(define-constant ERR-EMPTY-NAME (err u303))
(define-constant ERR-EMPTY-METADATA (err u304))
(define-constant ERR-NAME-SUSPENDED (err u305))
(define-constant ERR-SELF-TRANSFER (err u306))
(define-constant ERR-SELF-VERIFY (err u307))
(define-constant ERR-ALREADY-VERIFIED (err u308))
(define-constant ERR-INVALID-CATEGORY (err u309))

;; Status
(define-constant STATUS-PENDING u0)
(define-constant STATUS-VERIFIED u1)
(define-constant STATUS-SUSPENDED u2)

;; Categories
(define-constant CATEGORY-GENERAL u0)
(define-constant CATEGORY-STORE u1)
(define-constant CATEGORY-ARTIST u2)
(define-constant CATEGORY-SERVICE u3)
(define-constant CATEGORY-DAO u4)
(define-constant MAX-CATEGORY u10)

;; -----------------------------------------------
;; Data Variables
;; -----------------------------------------------
(define-data-var total-registrations uint u0)
(define-data-var total-verified uint u0)
(define-data-var total-transfers uint u0)

;; -----------------------------------------------
;; Maps
;; -----------------------------------------------
(define-map registry (string-ascii 64)
  {
    owner: principal,
    metadata: (string-ascii 256),
    category: uint,
    status: uint,
    registered-at: uint,
    last-updated: uint,
    verified-by: (optional principal),
    verification-count: uint,
    transfer-count: uint
  }
)

;; Reverse lookup: principal -> name
(define-map principal-to-name principal (string-ascii 64))

;; Track verifiers per name (prevent double-verify by same wallet)
(define-map verification-records { name: (string-ascii 64), verifier: principal } bool)

;; Track how many names each wallet owns
(define-map wallet-name-count principal uint)

;; -----------------------------------------------
;; Public Functions -- ALL BARRIER-FREE
;; -----------------------------------------------

;; Register a name -- any wallet can call, completely free
(define-public (register
    (name (string-ascii 64))
    (metadata (string-ascii 256))
    (category uint)
  )
  (begin
    (asserts! (> (len name) u0) ERR-EMPTY-NAME)
    (asserts! (> (len metadata) u0) ERR-EMPTY-METADATA)
    (asserts! (<= category MAX-CATEGORY) ERR-INVALID-CATEGORY)
    (asserts! (is-none (map-get? registry name)) ERR-NAME-TAKEN)

    (map-set registry name {
      owner: tx-sender,
      metadata: metadata,
      category: category,
      status: STATUS-PENDING,
      registered-at: stacks-block-height,
      last-updated: stacks-block-height,
      verified-by: none,
      verification-count: u0,
      transfer-count: u0
    })

    ;; Set reverse lookup
    (map-set principal-to-name tx-sender name)

    ;; Track wallet name count
    (let ((count (default-to u0 (map-get? wallet-name-count tx-sender))))
      (map-set wallet-name-count tx-sender (+ count u1))
    )

    (var-set total-registrations (+ (var-get total-registrations) u1))
    (print {
      event: "name-registered",
      name: name,
      owner: tx-sender,
      category: category
    })
    (ok true)
  )
)

;; Update metadata -- owner only
(define-public (update-metadata (name (string-ascii 64)) (new-metadata (string-ascii 256)))
  (let (
    (reg (unwrap! (map-get? registry name) ERR-NAME-NOT-FOUND))
  )
    (asserts! (is-eq (get owner reg) tx-sender) ERR-NOT-OWNER)
    (asserts! (not (is-eq (get status reg) STATUS-SUSPENDED)) ERR-NAME-SUSPENDED)
    (asserts! (> (len new-metadata) u0) ERR-EMPTY-METADATA)

    (map-set registry name (merge reg {
      metadata: new-metadata,
      last-updated: stacks-block-height
    }))

    (print {
      event: "metadata-updated",
      name: name,
      owner: tx-sender
    })
    (ok true)
  )
)

;; Update category -- owner only
(define-public (update-category (name (string-ascii 64)) (new-category uint))
  (let (
    (reg (unwrap! (map-get? registry name) ERR-NAME-NOT-FOUND))
  )
    (asserts! (is-eq (get owner reg) tx-sender) ERR-NOT-OWNER)
    (asserts! (not (is-eq (get status reg) STATUS-SUSPENDED)) ERR-NAME-SUSPENDED)
    (asserts! (<= new-category MAX-CATEGORY) ERR-INVALID-CATEGORY)

    (map-set registry name (merge reg {
      category: new-category,
      last-updated: stacks-block-height
    }))

    (print {
      event: "category-updated",
      name: name,
      new-category: new-category
    })
    (ok true)
  )
)

;; Transfer name ownership -- owner only
(define-public (transfer (name (string-ascii 64)) (new-owner principal))
  (let (
    (reg (unwrap! (map-get? registry name) ERR-NAME-NOT-FOUND))
  )
    (asserts! (is-eq (get owner reg) tx-sender) ERR-NOT-OWNER)
    (asserts! (not (is-eq (get status reg) STATUS-SUSPENDED)) ERR-NAME-SUSPENDED)
    (asserts! (not (is-eq tx-sender new-owner)) ERR-SELF-TRANSFER)

    (map-set registry name (merge reg {
      owner: new-owner,
      last-updated: stacks-block-height,
      transfer-count: (+ (get transfer-count reg) u1)
    }))

    ;; Update reverse lookups
    (map-set principal-to-name new-owner name)

    ;; Track new owner count
    (let ((count (default-to u0 (map-get? wallet-name-count new-owner))))
      (map-set wallet-name-count new-owner (+ count u1))
    )

    (var-set total-transfers (+ (var-get total-transfers) u1))
    (print {
      event: "name-transferred",
      name: name,
      from: tx-sender,
      to: new-owner
    })
    (ok true)
  )
)

;; Verify a registration -- any wallet can verify (community verification)
;; Cannot verify your own name. Each wallet can only verify a name once.
(define-public (verify (name (string-ascii 64)))
  (let (
    (reg (unwrap! (map-get? registry name) ERR-NAME-NOT-FOUND))
    (already-verified-by-caller (default-to false
      (map-get? verification-records { name: name, verifier: tx-sender })))
  )
    (asserts! (not (is-eq (get owner reg) tx-sender)) ERR-SELF-VERIFY)
    (asserts! (not already-verified-by-caller) ERR-ALREADY-VERIFIED)

    ;; Record this verification
    (map-set verification-records { name: name, verifier: tx-sender } true)

    ;; Update registration with new verification count
    (let ((new-count (+ (get verification-count reg) u1)))
      (map-set registry name (merge reg {
        verification-count: new-count,
        last-updated: stacks-block-height,
        ;; Auto-verify status after 3 independent verifications
        status: (if (>= new-count u3) STATUS-VERIFIED (get status reg)),
        verified-by: (if (>= new-count u3) (some tx-sender) (get verified-by reg))
      }))

      (if (>= new-count u3)
        (var-set total-verified (+ (var-get total-verified) u1))
        true
      )
    )

    (print {
      event: "name-verified",
      name: name,
      verifier: tx-sender,
      verification-count: (+ (get verification-count reg) u1)
    })
    (ok true)
  )
)

;; -----------------------------------------------
;; Read-Only Functions
;; -----------------------------------------------
(define-read-only (get-registration (name (string-ascii 64)))
  (map-get? registry name)
)

(define-read-only (get-name-by-principal (user principal))
  (map-get? principal-to-name user)
)

(define-read-only (get-wallet-name-count (user principal))
  (default-to u0 (map-get? wallet-name-count user))
)

(define-read-only (has-verified (name (string-ascii 64)) (verifier principal))
  (default-to false (map-get? verification-records { name: name, verifier: verifier }))
)

(define-read-only (is-name-available (name (string-ascii 64)))
  (is-none (map-get? registry name))
)

(define-read-only (get-registry-stats)
  {
    total-registrations: (var-get total-registrations),
    total-verified: (var-get total-verified),
    total-transfers: (var-get total-transfers)
  }
)

;; Clarity 4: to-ascii? for human-readable registry info
(define-read-only (get-registration-summary (name (string-ascii 64)))
  (match (map-get? registry name)
    reg (let (
      (verifications-ascii (match (to-ascii? (get verification-count reg)) ok-val ok-val err "0"))
      (transfers-ascii (match (to-ascii? (get transfer-count reg)) ok-val ok-val err "0"))
      (status-str (if (is-eq (get status reg) STATUS-PENDING) "PENDING"
        (if (is-eq (get status reg) STATUS-VERIFIED) "VERIFIED"
        "SUSPENDED")))
      (category-str (if (is-eq (get category reg) CATEGORY-GENERAL) "GENERAL"
        (if (is-eq (get category reg) CATEGORY-STORE) "STORE"
        (if (is-eq (get category reg) CATEGORY-ARTIST) "ARTIST"
        (if (is-eq (get category reg) CATEGORY-SERVICE) "SERVICE"
        (if (is-eq (get category reg) CATEGORY-DAO) "DAO"
        "PROJECT"))))))
    )
      (ok {
        metadata: (get metadata reg),
        category: category-str,
        status: status-str,
        verifications: verifications-ascii,
        transfers: transfers-ascii
      })
    )
    ERR-NAME-NOT-FOUND
  )
)
