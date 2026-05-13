# 01. Project Overview

## Ten he thong
`SQA E-commerce Mini System`

## Nguon goc he thong
He thong do nhom tu xay dung de phuc vu bai tap mon SQA / Dam bao chat luong phan mem, co su dung AI/Codex ho tro phan tich yeu cau, phat trien ma nguon, tao tai lieu, bo test va du lieu bao cao.

## Cong nghe su dung
- Frontend: React 19, Vite, TypeScript, React Router, Lucide React.
- Backend: Node.js, Express 5, TypeScript.
- Database: SQLite thong qua `better-sqlite3`.
- Authentication: JWT va `bcryptjs`.
- Validation: Zod.
- Test backend: Vitest + Supertest.
- Kieu trien khai: Chay local, khong dung dich vu cloud tra phi.

## Cac chuc nang chinh
1. Authentication & Authorization
   - Dang ky, dang nhap, logout phia client.
   - JWT, role `USER` va `ADMIN`.
   - Validate email/password.
   - Middleware chan route admin neu khong du quyen.
2. Product Management
   - Danh sach, chi tiet, search, filter danh muc, gia va ton kho.
   - Public route chi hien product `ACTIVE`.
   - Admin xem day du product `ACTIVE/INACTIVE`, them, sua, xoa khi duoc phep.
3. Cart & Checkout
   - Them, cap nhat, xoa gio hang.
   - Validate so luong khong vuot ton kho.
   - Checkout tao don hang `PENDING`, tru ton kho va clear cart.
4. Order Management
   - User xem don cua minh.
   - Admin xem tat ca don.
   - Transition logic: `PENDING -> CONFIRMED/CANCELLED`, `CONFIRMED -> SHIPPING/CANCELLED`, `SHIPPING -> COMPLETED/CANCELLED`.
5. Voucher / Discount
   - Admin tao voucher.
   - User apply voucher o cart/checkout.
   - Validate het han, usage limit, inactive, min order value.
6. Product Review
   - Review chi hop le neu don da `COMPLETED` va product nam trong don.
   - Rating 1-5, comment.
   - Chan duplicate review theo user/order/product.
   - `orders/mine` tra `items[].reviewed` de frontend an form da review.

## Hien trang dam bao chat luong ban dau
- Code da chia module ro theo controller/service/model/schema/route.
- API response thong nhat dang `{ success, message, data }`.
- Middleware auth/admin va validation da co.
- Checkout su dung transaction SQLite.
- Database co schema init va seed demo.
- Bo test backend da chay thanh cong `12/12` test.
- Backend build pass, frontend build pass.
- Smoke check pass:
  - Backend health endpoint tra `success=true`.
  - Frontend dev server tra HTTP 200.
- Tai lieu SQA da co trong `docs/`:
  - SRS
  - Test Plan
  - Review Checklist
  - Test Cases
  - Bug Report
  - API Document
  - Database Design
  - Group Assignment
  - Report Outline

## Cach cai dat/chay
### Backend
```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:init
npm.cmd run db:seed
npm.cmd run dev
```

Backend mac dinh: `http://localhost:4000`

### Frontend
```powershell
cd frontend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Frontend mac dinh: `http://localhost:5173`

### Chay test
```powershell
cd backend
npm.cmd test
```

### Tai khoan demo
- Admin: `admin@example.com` / `Admin@123`
- User: `user@example.com` / `User@123`
