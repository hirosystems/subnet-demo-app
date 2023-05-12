;; A tiny NFT marketplace that allows users to list NFT for sale. They can specify the following:
;; - The NFT token to sell.
;; - The NFT price in said payment asset.
;; - An optional intended taker. If set, only that principal will be able to fulfil the listing.
;;
;; Simplified version of: https://github.com/clarity-lang/book/tree/main/projects/tiny-market

(use-trait nft-trait 'ST000000000000000000002AMW42H.subnet.nft-trait)
;; (use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant contract-owner tx-sender)

(define-constant ERR_PRICE_ZERO (err u1001))

(define-constant ERR_UNKNOWN_LISTING (err u2020))
(define-constant ERR_UNAUTHORISED (err u2001))
(define-constant ERR_NFT_ASSET_MISMATCH (err u2003))
(define-constant ERR_MAKER_TAKER_EQUAL (err u2005))
(define-constant ERR_UNINTENDED_TAKER (err u2006))

(define-map listings
  {
    nft-contract: principal,
    nft-id: uint
  }
  {
    maker: principal,
    taker: (optional principal),
    price: uint,
  }
)

(define-private (transfer-nft
  (nft-contract <nft-trait>)
  (token-id uint)
  (sender principal)
  (recipient principal)
)
  (contract-call? nft-contract transfer token-id sender recipient)
)

(define-public (list-asset
  (nft-contract <nft-trait>)
  (nft-id uint)
  (nft-asset {
    taker: (optional principal),
    price: uint,
  })
)
  (begin
    (asserts! (> (get price nft-asset) u0) ERR_PRICE_ZERO)

    (try! (transfer-nft
      nft-contract
      nft-id
      tx-sender
      (as-contract tx-sender)
    ))
    (map-set listings
      { nft-contract: (contract-of nft-contract), nft-id: nft-id }
      (merge { maker: tx-sender } nft-asset)
    )

    (ok true)
  )
)

(define-public (cancel-listing (nft-contract <nft-trait>) (nft-id uint))
  (let (
    (key { nft-contract: (contract-of nft-contract), nft-id: nft-id })
    (listing (unwrap! (map-get? listings key) ERR_UNKNOWN_LISTING))
    (maker (get maker listing))
  )
    (asserts! (is-eq maker tx-sender) ERR_UNAUTHORISED)
    (map-delete listings key)

    (as-contract (transfer-nft nft-contract nft-id tx-sender maker))
  )
)

(define-private (assert-can-fulfil
  (key { nft-contract: principal, nft-id: uint })
  (listing {
    maker: principal,
    taker: (optional principal),
    price: uint,
  })
)
  (begin
    (asserts! (not (is-eq (get maker listing) tx-sender)) ERR_MAKER_TAKER_EQUAL)
    (asserts!
      (match (get taker listing) intended-taker (is-eq intended-taker tx-sender) true)
      ERR_UNINTENDED_TAKER
    )

    (ok true)
  )
)

(define-public (fulfil-listing (nft-contract <nft-trait>) (nft-id uint))
  (let (
    (key { nft-contract: (contract-of nft-contract), nft-id: nft-id })
    (listing (unwrap! (map-get? listings key) ERR_UNKNOWN_LISTING))
    (taker tx-sender)
  )
    (try! (assert-can-fulfil key listing))
    (try! (as-contract (transfer-nft nft-contract nft-id tx-sender taker)))
    (try! (stx-transfer? (get price listing) taker (get maker listing)))
    (map-delete listings key)

    (ok true)
  )
)
