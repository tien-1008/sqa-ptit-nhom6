# Source Code Link & Evidence Guide

## Thông tin project
- Tên project: `SQA E-commerce Mini System`
- Link Git: ............................................................
- Branch: `main` hoặc branch nhóm sử dụng khi nộp bài

## Hướng dẫn clone
```powershell
git clone <REPO_URL>
cd sqa-ecommerce-project
```

## Hướng dẫn chạy backend
```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run db:init
npm.cmd run db:seed
npm.cmd run dev
```

Backend mặc định:
- API base: `http://localhost:4000/api`
- Health check: `http://localhost:4000/api/health`

## Hướng dẫn chạy frontend
Mở terminal mới:

```powershell
cd frontend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Frontend mặc định:
- `http://localhost:5173`

## Hướng dẫn chạy test
```powershell
cd backend
npm.cmd test
```

Các automated test hiện có bao phủ:
- Login seed user
- Create product admin
- Public/admin visibility cho product `INACTIVE`
- Add to cart
- Apply voucher
- Seed voucher usage consistency
- Checkout
- Update order status
- Delete product history trả 409
- Create review, duplicate review, `items[].reviewed`
- Unit test transition order

## Tài khoản mẫu
- Admin: `admin@example.com` / `Admin@123`
- User: `user@example.com` / `User@123`

## Danh sách tài liệu minh chứng
- `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
- `reports/02_Ket_qua_review_nhom.xlsx`
- `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
- `reports/04_Bao_cao_tong_hop_SQA.md`
- `reports/evidence/source-code-link.md`
- `reports/evidence/EVIDENCE_INDEX.md`
- `reports/evidence/screenshots/*.png`
- `reports/evidence/unit-test-result/*.txt`
- `reports/evidence/api-test-result/*.txt`
- `reports/evidence/api-test-result/api-smoke-result.json`
- `reports/evidence/excel-evidence-audit-after.json`
- `reports/evidence/excel-evidence-created-aliases.json`
- `test-artifacts/API_TEST_RESULT_SAMPLE.md`
- `test-artifacts/UI_TEST_SESSION_TEMPLATE.md`
- `test-artifacts/TRACEABILITY_MATRIX_SAMPLE.md`

## Danh sách file báo cáo
- Kế hoạch kiểm thử nhóm: `reports/01_Ke_hoach_kiem_thu_nhom.xlsx`
- Kết quả review nhóm: `reports/02_Ket_qua_review_nhom.xlsx`
- Kết quả kiểm thử 5 thành viên: `reports/03_Ket_qua_kiem_thu_5_thanh_vien.xlsx`
- Báo cáo tổng hợp SQA: `reports/04_Bao_cao_tong_hop_SQA.md`
- Link source code và evidence guide: `reports/evidence/source-code-link.md`

## Thư mục lưu evidence bổ sung
- Screenshot UI: `reports/evidence/screenshots/`
- Kết quả unit test: `reports/evidence/unit-test-result/`
- Kết quả API test: `reports/evidence/api-test-result/`

Khi nhóm hoàn thiện báo cáo, nên lưu ảnh chụp và output test theo tên Evidence ID trong sheet `Evidence Index` của workbook kết quả kiểm thử.
