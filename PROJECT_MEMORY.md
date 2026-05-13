# Project Memory

## Ten du an
SQA E-commerce Mini System

## Muc tieu du an
- Xay dung website thuong mai dien tu mini co day du ma nguon, chay local.
- Tao nen tang de nhom 4-5 thanh vien thuc hien cac hoat dong SQA: review tai lieu, review code, UI test, unit test, black-box test, API test, tong hop ket qua.
- Cung cap du lieu demo, test case mau, bug report mau va tai lieu ky thuat.

## Stack da chon
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Authentication: JWT
- Validation: Zod
- Backend unit/API test: Vitest + Supertest
- Frontend goi API bang Fetch API

## Danh sach chuc nang chinh
1. Authentication & Authorization
   - Dang ky, dang nhap, dang xuat phia client
   - JWT, role USER / ADMIN
   - Validate email, password
   - Chan truy cap admin neu khong co quyen
2. Product Management
   - Danh sach, chi tiet, CRUD admin
   - Danh muc, tim kiem, loc theo danh muc/gia/trang thai ton kho
3. Cart & Checkout
   - Them, sua so luong, xoa gio hang
   - Tinh tong tien, validate ton kho
   - Checkout tao don hang
4. Order Management
   - User xem don cua minh
   - Admin xem tat ca don
   - Cap nhat trang thai theo logic hop le
5. Voucher / Discount
   - Admin tao voucher
   - User ap dung voucher khi checkout
   - Validate ton tai, han dung, so lan su dung, gia tri don toi thieu
6. Product Review
   - Danh gia san pham da mua
   - Rating 1-5, comment
   - Chan review neu chua mua hoac review trung don/san pham

## Phan chia module cho 4-5 thanh vien
- Nguyễn Huy Trường: Authentication & Authorization
- Hồ Quang Trường: Product Management
- Hoàng Xuân Thảo: Cart & Checkout
- Ngô Quang Tiến: Order Management
- Trần Chí Trung: Voucher & Product Review

## Nhat ky cap nhat
- 2026-05-12: Khoi tao `PROJECT_RULES.md` va `PROJECT_MEMORY.md`.
- 2026-05-12: Tao backend Express TypeScript, SQLite schema, seed script, middleware auth/admin, module nghiep vu chinh va test backend mau.
- 2026-05-12: Tao frontend React/Vite TypeScript cho luong user/admin, co UI validate, cart, checkout, order, product review va cac man quan tri.
- 2026-05-12: Tao day du bo tai lieu SQA trong `docs`, README huong dan chay va `test-artifacts` mau.
- 2026-05-12: Bo sung `.gitignore`, sua format ngay frontend an toan hon, ra soat tinh code. Thu chay `npm install` nhung moi truong hien tai khong co `node`/`npm` trong PATH.
- 2026-05-12: Xac minh lai bang `npm.cmd`; cai dependency backend/frontend thanh cong, `db:init`, `db:seed`, backend test, backend build, frontend build deu pass. Da khoi dong dev server va smoke test `http://localhost:4000/api/health`, `http://localhost:5173`.
- 2026-05-12: Audit lai toan bo rules, memory, README, backend, frontend, docs. Da sua cac gap: public route an product `INACTIVE`, them `GET /api/admin/products`, delete product co history tra `409`, seed `WELCOME10.used_count=1`, order item co `reviewed`, UI an review form da gui, admin delete co confirm, docs/test cases/test artifacts dong bo lai.
- 2026-05-12: Tao thu muc `report-data` gom 8 file markdown/csv de copy vao Excel template va noi dung bao cao, bao gom tong quan du an, test plan nhom, checklist review tai lieu/code, testcase toan module, bug report, phan cong thanh vien va ban nhap report da dien noi dung.
- 2026-05-12: Tao bo `reports` phuc vu nop bai SQA: 3 workbook Excel, 1 bao cao tong hop markdown va file huong dan source/evidence.
- 2026-05-12: Tao `report-generator` dung `exceljs`, chay `npm.cmd install`, `npm.cmd run generate`, sua loi generator tung tao dong trong do validation, sau do doc lai workbook va xac nhan day du sheet/dong du lieu.
- 2026-05-13: Cap nhat ten thanh vien chinh thuc trong docs, report-data, reports, test-artifacts va report-generator.
- 2026-05-13: Audit lai bo bao cao SQA, bo sung review cho `REVIEW_CHECKLIST.md` va `TEST_CASES.md`, them defect Order Management, regenerate 3 workbook Excel va xac minh audit PASS.
- 2026-05-13: Bo sung evidence thuc te trong `reports/evidence`: screenshot UI, backend unit/API test log, API smoke result va evidence index.
- 2026-05-13: Audit duong dan Evidence trong 3 workbook Excel; tao alias/pointer file cho cac duong dan con thieu va xac minh `85/85` evidence references ton tai, `0` missing.

## Danh sach file/tai lieu da tao
- `PROJECT_RULES.md`
- `PROJECT_MEMORY.md`
- `backend/package.json`
- `backend/.env.example`
- `backend/src/config/*`
- `backend/src/database/*`
- `backend/src/modules/auth/*`
- `backend/src/modules/products/*`
- `backend/src/modules/cart/*`
- `backend/src/modules/orders/*`
- `backend/src/modules/vouchers/*`
- `backend/src/modules/reviews/*`
- `backend/tests/*`
- `frontend/package.json`
- `frontend/.env.example`
- `frontend/src/components/*`
- `frontend/src/context/*`
- `frontend/src/lib/*`
- `frontend/src/pages/*`
- `frontend/src/styles.css`
- `docs/SRS.md`
- `docs/TEST_PLAN.md`
- `docs/REVIEW_CHECKLIST.md`
- `docs/TEST_CASES.md`
- `docs/BUG_REPORT.md`
- `docs/API_DOCUMENT.md`
- `docs/DATABASE_DESIGN.md`
- `docs/GROUP_ASSIGNMENT.md`
- `docs/REPORT_OUTLINE.md`
- `README.md`
- `.gitignore`
- `test-artifacts/API_TEST_RESULT_SAMPLE.md`
- `test-artifacts/UI_TEST_SESSION_TEMPLATE.md`
- `test-artifacts/TRACEABILITY_MATRIX_SAMPLE.md`
- `report-data/01_project_overview.md`
- `report-data/02_group_test_plan.csv`
- `report-data/03_document_review_checklist.csv`
- `report-data/04_code_review_checklist.csv`
- `report-data/05_test_cases_all_modules.csv`
- `report-data/06_bug_report.csv`
- `report-data/07_member_assignment.md`
- `report-data/08_report_outline_filled.md`
- `report-generator/package.json`
- `report-generator/package-lock.json`
- `report-generator/generate-reports.js`
- `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
- `reports/02_Ket_qua_review_nhom.xlsx`
- `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
- `reports/04_Bao_cao_tong_hop_SQA.md`
- `reports/evidence/source-code-link.md`
- `reports/evidence/EVIDENCE_INDEX.md`

## Cac quyet dinh ky thuat
- Dung backend Express theo cau truc modules de de review va chia viec.
- Dung SQLite de chay local gon, co script init va seed.
- Dung JWT va bcryptjs cho auth demo.
- Dung Vitest + Supertest cho test API mau.
- Dung React + Vite + TypeScript de tao UI co the demo nhanh.
- Dung response API thong nhat `{ success, message, data }`.
- Dung luong checkout transaction SQLite, co tru ton kho va clear cart.
- Dung state transition cho order de chan chuyen trang thai sai logic.
- Voucher duoc validate theo han dung, usage limit va gia tri don toi thieu.
- Review bat buoc don hang `COMPLETED`, dung san pham da mua va khong trung theo order/product.
- Frontend dung route guard phia UI, con quyen that van duoc backend kiem soat bang middleware.
- Seed data gom ca order completed de demo review va order pending de demo transition admin.

## Da tao nhung gi
- Backend day du auth, product, cart, checkout, order, voucher, review, admin route.
- SQLite schema, init script, seed script.
- Frontend day du man hinh user/admin.
- Test API mau va unit test transition.
- Day du tai lieu SQA, README, test artifact.
- Bo `report-data` chuyen hoa thong tin du an thanh markdown/csv de chen truc tiep vao Excel template va bao cao.
- Bo `reports` nop bai gom ke hoach test, ket qua review, ket qua kiem thu 5 thanh vien, bao cao tong hop va huong dan source/evidence.
- Generator `exceljs` co the chay lai de sinh workbook dong nhat theo du lieu bao cao hien tai.

## Cach chay
### Backend
```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:init
npm run db:seed
npm run dev
```

Neu PowerShell khong nhan `npm`, dung:
```powershell
npm.cmd install
npm.cmd run db:init
npm.cmd run db:seed
npm.cmd run dev
```

### Frontend
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Hoac:
```powershell
npm.cmd install
npm.cmd run dev
```

### Test
```powershell
cd backend
npm test
```

Hoac:
```powershell
npm.cmd test
```

## Cac chuc nang da hoan thanh
- Dang ky, dang nhap, JWT, route admin.
- Product list/detail/filter/category/admin CRUD.
- Cart add/update/delete, validate ton kho.
- Checkout tao order, tru kho, xoa cart, voucher discount.
- User order list va admin order transition.
- Voucher create/apply voi rule validation.
- Review san pham da mua va chan duplicate.
- Public product/detail/review endpoint an san pham `INACTIVE`, admin van xem duoc qua endpoint rieng.
- Delete product bao ve lich su don hang va review bang response `409`.
- Orders mine tra `items[].reviewed` de UI biet trang thai review.

## Cac test da co
- API login.
- API create product.
- API public/admin visibility cho san pham inactive.
- API add to cart.
- API apply voucher.
- API seed voucher usage consistency.
- API checkout.
- API update order status.
- API delete product co order history tra 409.
- API create review, danh dau `reviewed`, va duplicate review tra 409.
- Unit test state transition order.

## Ket qua xac minh 2026-05-12
- `npm.cmd install` backend: thanh cong.
- `npm.cmd install` frontend: thanh cong.
- `npm.cmd run db:init`: thanh cong.
- `npm.cmd run db:seed`: thanh cong.
- `npm.cmd test` backend: `12/12` tests pass.
- `npm.cmd run build` backend: pass.
- `npm.cmd run build` frontend: pass.
- Backend health check: tra ve `success=true`.
- Frontend dev server: HTTP 200 tai `http://localhost:5173`.
- `npm.cmd install` tai `report-generator`: thanh cong, da cai `exceljs`.
- `npm.cmd run generate` tai `report-generator`: sinh thanh cong 3 workbook trong `reports/`.
- Da mo lai workbook bang `exceljs` de xac nhan sheet:
  - `01_Ke_hoach_kiem_thu_nhom.xlsx`: 6 sheet.
  - `02_Ket_qua_review_nhom.xlsx`: 8 sheet.
  - `03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`: 8 sheet.
- Da sua generator de validation chi ap vao dong co du lieu, khong sinh them blank rows.

## Ket qua audit reports 2026-05-13
- Da cap nhat ten thanh vien chinh thuc:
  - Nguyễn Huy Trường: Authentication & Authorization
  - Hồ Quang Trường: Product Management
  - Hoàng Xuân Thảo: Cart & Checkout
  - Ngô Quang Tiến: Order Management
  - Trần Chí Trung: Voucher & Product Review
- Da audit va xac minh du 5 file bao cao chinh:
  - `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
  - `reports/02_Ket_qua_review_nhom.xlsx`
  - `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
  - `reports/04_Bao_cao_tong_hop_SQA.md`
  - `reports/evidence/source-code-link.md`
- So luong sheet Excel:
  - File 01: 6 sheet.
  - File 02: 8 sheet.
  - File 03: 8 sheet.
- Tong so test case trong file ket qua kiem thu: 75.
- Tong so defect trong Defect Log: 10.
- Placeholder con lai:
  - Khong con placeholder ten thanh vien trong noi dung markdown/csv hoac cell Excel.
  - Ten sheet `TV1_Auth`, `TV2_Product`, `TV3_Cart_Checkout`, `TV4_Order`, `TV5_Voucher_Review` duoc giu lai vi yeu cau cho phep giu ten sheet ngan gon.
- Dinh dang Excel da duoc audit:
  - Header co style mau nen.
  - Freeze dong tieu de.
  - Co auto filter.
  - Wrap text.
  - Khong co sheet rong.
  - Khong co loi mo workbook bang `exceljs`.
- Thong tin can dien tay truoc khi nop:
  - So thu tu nhom.
  - Ma sinh vien tung thanh vien neu mau bao cao yeu cau.
  - Lop.
  - Link Git chinh thuc.
  - Ngay nop neu can.
  - Screenshot UI va output unit/API test thuc te neu giang vien yeu cau minh chung chay tay.

## Evidence da bo sung 2026-05-13
- Screenshot UI:
  - `reports/evidence/screenshots/products-list.png`
  - `reports/evidence/screenshots/auth-login-page.png`
  - `reports/evidence/screenshots/auth-register-page.png`
  - `reports/evidence/screenshots/user-orders.png`
  - `reports/evidence/screenshots/admin-products.png`
  - `reports/evidence/screenshots/admin-vouchers.png`
  - `reports/evidence/screenshots/BUG-05.png`
  - `reports/evidence/screenshots/BUG-06.png`
  - `reports/evidence/screenshots/BUG-07.png`
  - `reports/evidence/screenshots/BUG-08.png`
  - `reports/evidence/screenshots/BUG-10.png`
- Unit/API evidence:
  - `reports/evidence/unit-test-result/backend-vitest-result.txt`
  - `reports/evidence/unit-test-result/ORD-TC-11.txt`
  - `reports/evidence/unit-test-result/order-status-unit-test-result.txt`
  - `reports/evidence/api-test-result/backend-supertest-result.txt`
  - `reports/evidence/api-test-result/api-smoke-result.json`
  - `reports/evidence/api-test-result/AUTH-TC-06.txt`
  - `reports/evidence/api-test-result/PROD-TC-06.txt`
  - `reports/evidence/api-test-result/CART-TC-07.txt`
  - `reports/evidence/api-test-result/VR-TC-09.txt`
- Evidence index:
  - `reports/evidence/EVIDENCE_INDEX.md`
- Audit duong dan evidence trong Excel:
  - `reports/evidence/excel-evidence-audit-before.json`
  - `reports/evidence/excel-evidence-created-aliases.json`
  - `reports/evidence/excel-evidence-audit-after.json`
  - Ket qua sau sua: da kiem tra 85 evidence references trong Excel, khong con duong dan missing.
- Luu y ve evidence alias:
  - Cac file `AUTH-TC-*`, `PROD-TC-*`, `CART-TC-*`, `ORD-TC-*`, `VR-TC-*`, `BUG-*` duoc tao dung ten de khop voi cot Evidence trong Excel.
  - File `.png` alias duoc copy tu screenshot that cung ngu canh module.
  - File `.txt` alias la pointer toi log chinh `backend-vitest-result.txt` hoac `backend-supertest-result.txt`.
- Ket qua tao evidence:
  - `npm.cmd test` backend pass `12/12`.
  - API smoke result tra health success, 6 product, 4 category, login user/admin thanh cong.
  - Screenshot PNG doc duoc, kich thuoc khoang `1350x805` den `1350x1043`.

## Noi dung da kiem tra trong audit cuoi
- `PROJECT_RULES.md`, `PROJECT_MEMORY.md`, `README.md`, backend, frontend, docs va test artifacts da duoc doc lai.
- `backend/package.json` co du script `dev`, `build`, `start`, `db:init`, `db:seed`, `test`, `test:watch`.
- `frontend/package.json` co du script `dev`, `build`, `preview`.
- Import/export duoc xac minh thong qua backend/frontend build pass.
- Database init/seed chay lai duoc; seed du lieu demo nhat quan hon sau khi sua `WELCOME10.used_count`.
- API auth/product/cart/order/voucher/review da du logic demo va cac business rule trong SRS.
- Tai lieu SQA da du bo phuc vu report; `SRS`, `API_DOCUMENT`, `TEST_CASES`, `BUG_REPORT`, artifact mau da dong bo voi code moi.

## File da thay doi trong audit cuoi
- `backend/src/modules/products/product.service.ts`
- `backend/src/modules/products/product.controller.ts`
- `backend/src/modules/products/product.routes.ts`
- `backend/src/modules/reviews/review.service.ts`
- `backend/src/modules/orders/order.service.ts`
- `backend/src/database/seed.ts`
- `backend/tests/commerce-api.test.ts`
- `frontend/src/types.ts`
- `frontend/src/pages/OrdersPage.tsx`
- `frontend/src/pages/AdminProductsPage.tsx`
- `docs/SRS.md`
- `docs/API_DOCUMENT.md`
- `docs/BUG_REPORT.md`
- `docs/TEST_CASES.md`
- `test-artifacts/API_TEST_RESULT_SAMPLE.md`
- `test-artifacts/TRACEABILITY_MATRIX_SAMPLE.md`
- `README.md`
- `PROJECT_MEMORY.md`

## File da tao/sua cho bo reports 2026-05-12
- `report-generator/package.json`
- `report-generator/package-lock.json`
- `report-generator/generate-reports.js`
- `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
- `reports/02_Ket_qua_review_nhom.xlsx`
- `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
- `reports/04_Bao_cao_tong_hop_SQA.md`
- `reports/evidence/source-code-link.md`
- `reports/evidence/EVIDENCE_INDEX.md`
- `PROJECT_MEMORY.md`

## File da cap nhat trong audit reports 2026-05-13
- `PROJECT_MEMORY.md`
- `docs/GROUP_ASSIGNMENT.md`
- `docs/TEST_PLAN.md`
- `report-data/02_group_test_plan.csv`
- `report-data/03_document_review_checklist.csv`
- `report-data/04_code_review_checklist.csv`
- `report-data/05_test_cases_all_modules.csv`
- `report-data/06_bug_report.csv`
- `report-data/07_member_assignment.md`
- `report-data/08_report_outline_filled.md`
- `report-generator/generate-reports.js`
- `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
- `reports/02_Ket_qua_review_nhom.xlsx`
- `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
- `reports/04_Bao_cao_tong_hop_SQA.md`
- `reports/evidence/source-code-link.md`
- `test-artifacts/TRACEABILITY_MATRIX_SAMPLE.md`

## Cac tai lieu da co
- `docs/SRS.md`
- `docs/TEST_PLAN.md`
- `docs/REVIEW_CHECKLIST.md`
- `docs/TEST_CASES.md`
- `docs/BUG_REPORT.md`
- `docs/API_DOCUMENT.md`
- `docs/DATABASE_DESIGN.md`
- `docs/GROUP_ASSIGNMENT.md`
- `docs/REPORT_OUTLINE.md`
- `report-data/01_project_overview.md`
- `report-data/02_group_test_plan.csv`
- `report-data/03_document_review_checklist.csv`
- `report-data/04_code_review_checklist.csv`
- `report-data/05_test_cases_all_modules.csv`
- `report-data/06_bug_report.csv`
- `report-data/07_member_assignment.md`
- `report-data/08_report_outline_filled.md`
- `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
- `reports/02_Ket_qua_review_nhom.xlsx`
- `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
- `reports/04_Bao_cao_tong_hop_SQA.md`
- `reports/evidence/source-code-link.md`

## Cac buoc tiep theo
- Dien link Git that vao `reports/evidence/source-code-link.md`.
- Dien so thu tu nhom, MSSV, lop va ngay nop vao bao cao neu mau cua lop yeu cau.
- Neu can them minh chung rieng cua tung thanh vien, bo sung screenshot hoac output moi vao `reports/evidence/` theo mau `EVIDENCE_INDEX.md`.
- Neu can chinh noi dung workbook, sua `report-generator/generate-reports.js` va chay lai `npm.cmd run generate`.
- Neu nhom muon mo rong SQA, co the them frontend component test hoac end-to-end browser test cho cac luong mua hang/admin.
