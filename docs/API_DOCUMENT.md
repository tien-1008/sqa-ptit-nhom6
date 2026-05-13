# API Document

## Response format chung
```json
{
  "success": true,
  "message": "Operation completed.",
  "data": {}
}
```

## 1. Authentication
| Method | URL | Request body | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | `{ "name": "...", "email": "...", "password": "..." }` | No |
| POST | `/api/auth/login` | `{ "email": "...", "password": "..." }` | No |
| GET | `/api/auth/me` | None | User/Admin |

### Login response mau
```json
{
  "success": true,
  "message": "Login completed.",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 2,
      "email": "user@example.com",
      "name": "Demo Customer",
      "role": "USER"
    }
  }
}
```

## 2. Product
| Method | URL | Request body/query | Auth |
|---|---|---|---|
| GET | `/api/products` | Query: `search`, `categoryId`, `minPrice`, `maxPrice`, `inStock` | No |
| GET | `/api/products/categories` | None | No |
| GET | `/api/products/:productId` | None | No |
| GET | `/api/products/:productId/reviews` | None | No |
| GET | `/api/admin/products` | Query: `search`, `categoryId`, `minPrice`, `maxPrice`, `inStock` | Admin |
| POST | `/api/admin/products` | Product payload | Admin |
| PATCH | `/api/admin/products/:productId` | Partial product payload | Admin |
| DELETE | `/api/admin/products/:productId` | None | Admin |

Ghi chu:
- `/api/products` va `/api/products/:productId` chi tra san pham `ACTIVE`.
- `/api/products/:productId/reviews` cung tra `404` neu product khong ton tai hoac `INACTIVE`.
- `/api/admin/products` tra ca `ACTIVE` va `INACTIVE`.
- Delete product tra `409` neu san pham da co order/review history.

### Product payload
```json
{
  "categoryId": 3,
  "name": "Regression Mouse",
  "description": "Mouse demo de test admin CRUD.",
  "price": 650000,
  "stock": 9,
  "status": "ACTIVE",
  "imageUrl": ""
}
```

## 3. Cart
| Method | URL | Request body | Auth |
|---|---|---|---|
| GET | `/api/cart` | None | User/Admin |
| POST | `/api/cart/items` | `{ "productId": 1, "quantity": 2 }` | User/Admin |
| PATCH | `/api/cart/items/:productId` | `{ "quantity": 3 }` | User/Admin |
| DELETE | `/api/cart/items/:productId` | None | User/Admin |

## 4. Voucher
| Method | URL | Request body | Auth |
|---|---|---|---|
| POST | `/api/vouchers/apply` | `{ "code": "WELCOME10" }` | User/Admin |
| GET | `/api/admin/vouchers` | None | Admin |
| POST | `/api/admin/vouchers` | Voucher payload | Admin |

### Voucher payload
```json
{
  "code": "SPRING15",
  "description": "Giam 15% cho don demo.",
  "discountType": "PERCENT",
  "discountValue": 15,
  "maxDiscount": 600000,
  "minOrderValue": 1000000,
  "usageLimit": 30,
  "expiresAt": "2030-12-31T23:59:59.000Z",
  "isActive": true
}
```

## 5. Checkout & Order
| Method | URL | Request body | Auth |
|---|---|---|---|
| POST | `/api/orders/checkout` | Checkout payload | User/Admin |
| GET | `/api/orders/mine` | None | User/Admin |
| GET | `/api/admin/orders` | None | Admin |
| PATCH | `/api/admin/orders/:orderId/status` | `{ "status": "CONFIRMED" }` | Admin |

`GET /api/orders/mine` tra `items[].reviewed` de frontend biet san pham trong don completed nao da duoc danh gia.

### Checkout payload
```json
{
  "shippingName": "Demo Customer",
  "shippingPhone": "0900000001",
  "shippingAddress": "99 Quality Avenue, Ho Chi Minh City",
  "voucherCode": "WELCOME10"
}
```

## 6. Review
| Method | URL | Request body | Auth |
|---|---|---|---|
| POST | `/api/reviews` | Review payload | User/Admin |

### Review payload
```json
{
  "orderId": 1,
  "productId": 4,
  "rating": 5,
  "comment": "San pham dung mong doi, phu hop demo."
}
```

## 7. Error response mau
```json
{
  "success": false,
  "message": "Voucher has expired.",
  "data": null
}
```

## 8. Ghi chu auth
- Header: `Authorization: Bearer <jwt-token>`
- Route admin can `role = ADMIN`.
- Route cart/order/review can JWT hop le.
