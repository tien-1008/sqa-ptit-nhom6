# API Test Result Sample

| Test | Endpoint | Expected | Actual | Status |
|---|---|---|---|---|
| Login user | `POST /api/auth/login` | 200, token | Chua cap nhat | Not Run |
| Create product | `POST /api/admin/products` | 201 | Chua cap nhat | Not Run |
| Product visibility | `GET /api/products`, `GET /api/admin/products` | Public an inactive, admin thay day du | Chua cap nhat | Not Run |
| Apply voucher | `POST /api/vouchers/apply` | Discount dung | Chua cap nhat | Not Run |
| Checkout | `POST /api/orders/checkout` | Order `PENDING` | Chua cap nhat | Not Run |
| Update status | `PATCH /api/admin/orders/:id/status` | Status hop le | Chua cap nhat | Not Run |
| Delete guarded product | `DELETE /api/admin/products/:id` | 409 neu da co order history | Chua cap nhat | Not Run |
| Review duplicate | `POST /api/reviews` | Lan dau 201, lan sau 409 | Chua cap nhat | Not Run |

## Ghi chu
- Co the dinh kem screenshot terminal `npm test`.
- Co the bo sung request/response body thuc te sau khi test.
