(define-constant ERR_NOT_AUTHORIZED (err u1001))
(define-constant ERR_MINT_LIMIT_REACHED (err u1002))

(impl-trait 'ST000000000000000000002AMW42H.subnet.subnet-asset)
;; (impl-trait .subnet.nft-trait)
(impl-trait 'ST000000000000000000002AMW42H.subnet.nft-trait)
;; (impl-trait .subnet.subnet-asset)

(define-constant MAX_MINT_PER_ADDRESS u15)
(define-constant MINT_PRICE u10000000)

(define-data-var last-id uint u0)
(define-data-var base-uri (optional (string-ascii 256)) none)

(define-map mint-limits principal uint)

(define-non-fungible-token parfait-nft uint)

;; NFT trait functions
(define-read-only (get-last-token-id)
  (ok (var-get last-id))
)

(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? parfait-nft id))
)

(define-read-only (get-token-uri (id uint))
  (ok (var-get base-uri))
)

(define-public (mint)
  (let (
    (new-id (+ (var-get last-id) u1))
    (nb-minted-by-sender (default-to u0 (map-get? mint-limits tx-sender)))
  )
    (asserts! (< nb-minted-by-sender MAX_MINT_PER_ADDRESS) ERR_MINT_LIMIT_REACHED)
    (try! (stx-transfer? MINT_PRICE tx-sender (as-contract tx-sender)))
    (map-set mint-limits tx-sender (+ nb-minted-by-sender u1))
    (var-set last-id new-id)
    (nft-mint? parfait-nft new-id tx-sender)
  )
)

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
    (nft-transfer? parfait-nft id sender recipient)
  )
)

(define-read-only (get-token-owner (id uint))
  (nft-get-owner? parfait-nft id)
)

;; Called for deposit from the burnchain to the subnet
(define-public (deposit-from-burnchain (id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender 'ST000000000000000000002AMW42H) ERR_NOT_AUTHORIZED)
    (nft-mint? parfait-nft id recipient)
  )
)

;; Called for withdrawal from the subnet to the burnchain
(define-public (burn-for-withdrawal (id uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) ERR_NOT_AUTHORIZED)
    (nft-burn? parfait-nft id owner)
  )
)
