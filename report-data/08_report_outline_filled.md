# 08. Report Outline Filled

## Trang bia
- Ten truong: [Dien thong tin cua nhom].
- Khoa/bo mon: [Dien thong tin].
- Mon hoc: Dam bao chat luong phan mem / SQA.
- De tai: `SQA E-commerce Mini System`.
- Nhom thuc hien: [Danh sach ho ten va MSSV].
- Giang vien huong dan: [Dien thong tin].
- Thoi gian bao cao: [Dien ngay nop].

## Phan 1: Cong viec chung cua nhom

### 1. Mo ta he thong
Nhom xay dung mot website thuong mai dien tu mini chay local, muc tieu la tao du ngu canh nghiep vu de thuc hanh cac hoat dong SQA. He thong gom frontend React, backend Express TypeScript va database SQLite. Luong chuc nang duoc thiet ke lien thong tu dang nhap, xem san pham, gio hang, checkout, quan ly don, voucher den review san pham.

Nguon goc he thong: he thong do nhom tu xay dung, co su dung AI/Codex ho tro phat trien ma nguon, review logic, tao tai lieu, bo test va du lieu phuc vu bao cao.

Actor chinh:
- Guest: xem product public, dang ky, dang nhap.
- User: thao tac cart, checkout, xem order, review san pham da mua.
- Admin: CRUD product, tao voucher, xem/cap nhat order.

### 2. Cong nghe su dung
- Frontend: React 19, Vite, TypeScript, React Router.
- Backend: Node.js, Express 5, TypeScript.
- Database: SQLite qua `better-sqlite3`.
- Security demo: JWT, bcryptjs.
- Validation: Zod.
- Testing: Vitest, Supertest.
- Van hanh local: `npm.cmd`, file `.env`, script init/seed.

### 3. Chuc nang chinh
1. Authentication & Authorization
   - Register/login, JWT, role `USER`/`ADMIN`, chan admin route.
2. Product Management
   - List/detail/search/filter, admin list full, create/update/delete guard.
3. Cart & Checkout
   - Add/update/remove cart, validate ton kho, checkout transaction.
4. Order Management
   - Orders mine, admin all orders, state transition va restore stock khi cancel.
5. Voucher
   - Create/apply voucher, validate rule expired/usage/min order.
6. Review
   - Review completed purchase, duplicate guard, reviewed state cho frontend.

### 4. Hien trang dam bao chat luong
Tinh den dot audit cuoi:
- Backend va frontend build thanh cong.
- Database init va seed chay lai duoc.
- Backend co `12/12` test pass.
- Health endpoint backend tra `success=true`.
- Frontend dev server tra HTTP 200.
- API response da thong nhat `{ success, message, data }`.
- Cac request chinh co validation bang Zod.
- Auth/admin da duoc bao ve bang middleware.
- Checkout su dung transaction de giam loi cap nhat nua chung.
- Bug quan trong ve product inactive visibility, delete product co history, review form lap lai da duoc xu ly.

### 5. Ket qua ra soat checklist
#### Tai lieu
- SRS co actor, scope, business rule, use case.
- Test Plan co muc tieu, pham vi, lich gia dinh, entry/exit criteria, risk.
- API document da cap nhat route admin product va reviewed flag.
- Database design mo ta bang va quan he.

#### Code
- Module tach ro controller/service/schema/route.
- Auth, product, cart, order, voucher, review deu co logic that.
- Error handler gom ve format response chung.
- Import/export duoc xac minh qua TypeScript build.

#### UI/UX
- Co layout, login/register, product list/detail, cart, checkout, orders.
- Co trang admin products/orders/vouchers.
- UI hien thi loi backend.
- Confirm delete san pham da duoc them.
- Review form duoc an sau khi item da danh gia.

#### Kiem thu da co
- Unit/API regression: `12/12` test pass.
- Test case toan bo module: co positive, negative, boundary, authorization.
- Bug report: co defect va resolution hop ly de dua vao phan danh gia.

## Phan 2: Ket qua tung thanh vien

### Nguyễn Huy Trường - Authentication & Authorization
- Review tai lieu:
  - Kiem tra SRS va API auth co mo ta ro email/password/JWT/admin guard.
- Review code:
  - `auth.schema.ts`, `auth.service.ts`, `middlewares/auth.ts`.
- Test case:
  - Login dung/sai, register invalid, user goi admin route.
- Loai kiem thu:
  - API, black-box validation, security basic, UI form.
- Ket qua mong doi dua vao bao cao:
  - Chung minh route admin bi chan khi user khong du quyen.

### Hồ Quang Trường - Product Management
- Review tai lieu:
  - Product section trong SRS/API document.
- Review code:
  - Public visibility active only.
  - Admin list full.
  - Delete product history guard.
- Test case:
  - Search/filter, create/edit, inactive visibility, delete 409.
- Loai kiem thu:
  - API, UI, boundary, code review data integrity.
- Ket qua mong doi:
  - Chung minh public/admin scope khac nhau va du lieu lich su duoc bao ve.

### Hoàng Xuân Thảo - Cart & Checkout
- Review tai lieu:
  - Cart/Checkout requirement va database relation.
- Review code:
  - Stock validation.
  - Checkout transaction.
- Test case:
  - Add/update/remove item, cart empty checkout, checkout voucher.
- Loai kiem thu:
  - Black-box workflow, API integration, UI manual test.
- Ket qua mong doi:
  - Chung minh total amount, voucher amount va stock rule hoat dong.

### Ngô Quang Tiến - Order Management
- Review tai lieu:
  - State transition va actor admin/user.
- Review code:
  - `allowedTransitions`.
  - Restore stock khi cancel.
- Test case:
  - Orders mine, admin orders, transition hop le va sai logic.
- Loai kiem thu:
  - Unit transition test, API, UI admin order.
- Ket qua mong doi:
  - Chung minh order khong bi quay lui sai rule.

### Trần Chí Trung - Voucher & Product Review
- Review tai lieu:
  - Voucher/review rule, defect log.
- Review code:
  - Voucher validate rule.
  - Review completed purchase va duplicate.
  - `reviewed` flag.
- Test case:
  - Duplicate voucher, expired voucher, min order, review completed/pending/duplicate.
- Loai kiem thu:
  - API rule validation, UI checkout/review, defect analysis.
- Ket qua mong doi:
  - Chung minh discount rule chinh xac va UI review khong cho thao tac lap lai vo nghia.

## Phu luc goi y dua vao bao cao
- Anh terminal `npm.cmd test` ket qua `12/12`.
- Anh frontend login, product list, cart, checkout, admin orders.
- CSV trong `report-data/` copy vao Excel template.
- Bug table tu `06_bug_report.csv`.
- Checklist review tu `03_document_review_checklist.csv` va `04_code_review_checklist.csv`.
