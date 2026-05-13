# SQA E-commerce Mini System

## Gioi thieu
Day la du an website thuong mai dien tu mini dung cho bai tap nhom mon SQA / Dam bao chat luong phan mem. He thong co backend, frontend, SQLite, auth JWT, du lieu seed, API test mau va day du tai lieu phuc vu review/test/report.

## Cong nghe su dung
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Auth: JWT + bcryptjs
- Validation: Zod
- Test backend: Vitest + Supertest

## Cau truc thu muc
```text
.
|-- backend/
|-- frontend/
|-- docs/
|-- test-artifacts/
|-- PROJECT_RULES.md
|-- PROJECT_MEMORY.md
`-- README.md
```

## Cai dat backend
```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:init
npm run db:seed
npm run dev
```

Backend mac dinh chay tai `http://localhost:4000`.

Neu PowerShell khong nhan lenh `npm`, dung bien the Windows:
```powershell
npm.cmd install
npm.cmd run db:init
npm.cmd run db:seed
npm.cmd run dev
```

## Cai dat frontend
Mo terminal moi:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend mac dinh chay tai `http://localhost:5173`.

Bien the Windows neu can:
```powershell
npm.cmd install
npm.cmd run dev
```

## Tai khoan mau
- Admin: `admin@example.com` / `Admin@123`
- User: `user@example.com` / `User@123`

## Chay database seed
```powershell
cd backend
npm run db:init
npm run db:seed
```

Seed data tao:
- 2 tai khoan mau.
- 4 danh muc.
- 6 san pham.
- 3 voucher demo.
- 1 order completed va 1 order pending cho user demo.

## Chay test
```powershell
cd backend
npm test
```

Hoac:
```powershell
npm.cmd test
```

Bo test hien co cover:
- Login
- Create product
- Public/admin product visibility cho san pham `INACTIVE`
- Add to cart
- Apply voucher
- Seed voucher usage consistency
- Checkout
- Update order status
- Chan xoa product co order history
- Create/duplicate product review va trang thai `reviewed`
- Unit test order state transition

## Tai lieu trong `docs`
- [SRS](docs/SRS.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Review Checklist](docs/REVIEW_CHECKLIST.md)
- [Test Cases](docs/TEST_CASES.md)
- [Bug Report](docs/BUG_REPORT.md)
- [API Document](docs/API_DOCUMENT.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [Group Assignment](docs/GROUP_ASSIGNMENT.md)
- [Report Outline](docs/REPORT_OUTLINE.md)

## Cach dung du an cho bai SQA
1. Review `SRS.md`, `API_DOCUMENT.md`, `DATABASE_DESIGN.md`.
2. Dung `REVIEW_CHECKLIST.md` de tao bang ra soat.
3. Chay seed data va demo luong nguoi dung/admin tren frontend.
4. Thuc thi test trong `TEST_CASES.md`, cap nhat Actual Result/Status.
5. Dung `BUG_REPORT.md` lam mau defect log, bo sung defect moi neu tim thay.
6. Chay `npm test` de dua bang chung unit/API test vao bao cao.
7. Tong hop theo `REPORT_OUTLINE.md`.

## Ghi chu trien khai
- Khong co thanh toan that.
- Secret JWT trong `.env` chi dung local demo.
- Neu frontend khong goi duoc API, kiem tra `VITE_API_URL` va backend port.
