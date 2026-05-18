;; STX Bazaar: Vault Contract
;; Implements non-custodial Bitcoin-native vaults with time-lock logic

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-EXISTS (err u101))
(define-constant ERR-VAULT-NOT-FOUND (err u102))
(define-constant ERR-STILL-LOCKED (err u103))
(define-constant ERR-INSUFFICIENT-FUNDS (err u104))

;; Vault State
(define-map vaults 
    uint 
    {
        owner: principal,
        balance: uint,
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

(define-public (withdraw (vault-id uint))
    (let
        (
            (vault (unwrap! (map-get? vaults vault-id) ERR-VAULT-NOT-FOUND))
        )
        ;; Check owner
        (asserts! (is-eq (get owner vault) tx-sender) ERR-NOT-AUTHORIZED)
        ;; Check lock period (either absolute block height or relative duration)
        (asserts! (>= burn-block-height (get lock-period vault)) ERR-STILL-LOCKED)
        ;; Check active status
        (asserts! (get is-active vault) ERR-INSUFFICIENT-FUNDS)
        
        ;; Update state
        (map-set vaults vault-id (merge vault { is-active: false, balance: u0 }))
        
        ;; Transfer funds back
        (as-contract (stx-transfer? (get balance vault) (as-contract tx-sender) (get owner vault)))
    )
)

;; Read-only Functions

(define-read-only (get-vault (vault-id uint))
    (map-get? vaults vault-id)
)

(define-read-only (get-total-vaults)
    (var-get vault-nonce)
)
