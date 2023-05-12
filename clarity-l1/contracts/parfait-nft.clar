(define-constant ERR_NOT_AUTHORIZED (err u1001))

(impl-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)
(impl-trait 'ST13F481SBR0R7Z6NMMH8YV2FJJYXA5JPA0AD3HP9.subnet-traits-v1.mint-from-subnet-trait)

(define-data-var last-id uint u0)
(define-data-var base-uri (optional (string-ascii 256)) none)

(define-non-fungible-token parfait-nft uint)

(define-read-only (get-last-token-id)
  (ok (var-get last-id))
)

(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? parfait-nft id))
)

(define-read-only (get-token-uri (id uint))
  (ok (var-get base-uri))
)

(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    ;; #[#filter(sender)]
    (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
    (nft-transfer? parfait-nft id sender recipient)
  )
)

(define-public (mint-from-subnet (id uint) (sender principal) (recipient principal))
  (begin
    ;; #[#filter(sender)]
    (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
    (nft-mint? parfait-nft id recipient)
  )
)

;; Test function that allow direct mint on L2.
;; Should not be deployed but still includes safety check
(define-public (test-mint)
  (let ((new-id (+ (var-get last-id) u1)))
    (asserts! (is-some (index-of?
      (list
        'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 ;; wallet_1
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG ;; wallet_2
      )
      tx-sender
    )) ERR_NOT_AUTHORIZED)

    (var-set last-id new-id)
    (nft-mint? parfait-nft new-id tx-sender)
  )
)
