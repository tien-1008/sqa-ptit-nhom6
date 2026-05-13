# BÁO CÁO BÀI TẬP DỰ ÁN NHÓM MÔN ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM

## Trang bìa
- Số thứ tự nhóm: ............................................................
- Tên chủ đề: `SQA E-commerce Mini System`
- Danh sách thành viên và chức năng phụ trách:
  - Nguyễn Huy Trường - Authentication & Authorization
  - Hồ Quang Trường - Product Management
  - Hoàng Xuân Thảo - Cart & Checkout
  - Ngô Quang Tiến - Order Management
  - Trần Chí Trung - Voucher & Product Review

## Phần 1 – Công việc chung của nhóm

### 1.1 Mô tả hệ thống
`SQA E-commerce Mini System` là website thương mại điện tử mini phục vụ bài tập nhóm môn Đảm bảo chất lượng phần mềm. Hệ thống do nhóm tự xây dựng, có sử dụng AI/Codex hỗ trợ phát triển, rà soát source code và chuẩn hóa bộ tài liệu báo cáo.

Stack hiện tại:
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Authentication: JWT
- Validation: Zod
- Backend test: Vitest + Supertest

Các chức năng chính đã có:
- Đăng ký, đăng nhập, đăng xuất phía client, phân quyền USER / ADMIN.
- Danh sách sản phẩm, chi tiết, tìm kiếm, lọc, CRUD admin.
- Giỏ hàng, cập nhật số lượng, checkout giả lập, kiểm tra tồn kho.
- User xem đơn của mình, admin xem toàn bộ đơn và chuyển trạng thái hợp lệ.
- Voucher có expiry, usage limit, min order, max discount.
- Review sản phẩm đã mua trong đơn `COMPLETED`, chặn duplicate review.

Hiện trạng đảm bảo chất lượng ban đầu:
- Source chia module rõ theo controller/service/schema/model hoặc cấu trúc tương đương.
- API dùng envelope `{ success, message, data }`.
- Backend có middleware auth/admin và validate request.
- SQLite có init/seed data; seed tạo account demo, voucher, order completed/pending.
- Test backend đã có 12 bài test pass trong audit trước, gồm login, create product, cart, voucher, checkout, order transition, delete product history, review duplicate.
- Một số finding UI/UX mức Low/Medium vẫn được giữ trong bộ báo cáo để nhóm phân tích, retest và đề xuất cải tiến.

### 1.2 Kết quả rà soát theo checklist
Review tài liệu:
- `README.md` đủ hướng dẫn cài backend/frontend, seed data, test và tài khoản mẫu.
- `SRS.md` đã phản ánh business rule thực tế như inactive product, delete history 409, checkout transaction, review completed order.
- `API_DOCUMENT.md` bao quát auth, product, cart, voucher, checkout, order và review.
- `DATABASE_DESIGN.md` thể hiện đầy đủ 8 bảng nghiệp vụ, quan hệ, constraint và unique review.
- `TEST_PLAN.md` có scope, ngoài phạm vi, nhân sự, entry/exit criteria, risk.
- `REVIEW_CHECKLIST.md` bao phủ review tài liệu, API, code, bảo mật và UI/UX.
- `TEST_CASES.md` có baseline test case cho toàn bộ 5 module, gồm cả positive và negative case.

Review API và database:
- Product public chỉ trả `ACTIVE`, admin có endpoint riêng xem đầy đủ.
- Delete product có order/review history trả 409 thay vì lỗi server.
- Checkout chạy transaction, validate stock và voucher trước khi tạo order.
- Order transition tuân thủ state machine.
- Review dùng unique constraint `(user_id, order_id, product_id)`.

Review code chung:
- Query SQL dùng prepared statement.
- Auth secret đọc từ env, không hardcode token thật.
- Error handler và response format nhất quán.
- Có automated test baseline cho những luồng rủi ro cao.

Tổng hợp vấn đề phát hiện trong review:
- Link checkout vẫn xuất hiện ở header cart khi giỏ trống.
- Checkout UI chưa có inline validation đầy đủ cho shipping fields.
- Client chưa chủ động dọn session khi JWT expired.
- Lỗi voucher và lỗi checkout cùng dùng một vùng message, ngữ cảnh chưa thật rõ.

Các finding đã xử lý trong audit trước:
- Product inactive bị lộ ở public route.
- Delete product có history từng có nguy cơ trả lỗi 500.
- Review form từng còn hiển thị sau khi submit.
- Delete product admin từng thiếu confirm dialog.

### 1.3 Kế hoạch kiểm thử
Mục tiêu:
- Kiểm tra đúng yêu cầu chức năng và business rule.
- Phát hiện lỗi validation, phân quyền, dữ liệu và UX.
- Cung cấp bằng chứng cho báo cáo nhóm.

Phạm vi:
- 5 module chính theo phân công thành viên.
- UI test, unit test, black-box/API test, review tài liệu và review code.

Môi trường:
- Windows 10/11 hoặc tương đương.
- Node.js LTS, SQLite local, Chrome/Edge.
- Chạy local qua VSCode terminal với `npm.cmd`.

Nhân sự:
- Nguyễn Huy Trường: Auth/AuthZ.
- Hồ Quang Trường: Product.
- Hoàng Xuân Thảo: Cart/Checkout.
- Ngô Quang Tiến: Order.
- Trần Chí Trung: Voucher/Review.

Loại kiểm thử:
- UI: form, thông báo lỗi, route guard, luồng admin/user.
- Unit: rule transition, schema và service helper khi mở rộng.
- Black-box/API: request/response và business outcome.
- Review: tài liệu, API, database, code và security basic.

Tiêu chí pass/fail:
- PASS khi actual result khớp expected result, response code/format đúng, không vi phạm business rule.
- FAIL khi sai authorization, sai tổng tiền/tồn kho, sai transition, validation không đạt hoặc UI gây hiểu nhầm đáng kể.

## Phần 2 – Kết quả từng thành viên

### 2.1 Nguyễn Huy Trường - Authentication & Authorization
- Review tài liệu chức năng: kiểm tra actor Guest/User/Admin, password rule, auth scope và admin guard.
- Review code: `auth.schema.ts`, auth service, middleware, `AuthContext.tsx`, `api.ts`.
- Kiểm thử giao diện: register, login, logout, route admin đối với USER.
- Unit test: đề xuất test password policy, email normalization, helper guard.
- Black-box/API test: login user seed đã có verdict PASS; các case sai password/admin guard để nhóm chạy thêm.
- Kết quả và đánh giá: backend auth rõ ràng; finding còn lại là session expiry UX ở client.

### 2.2 Hồ Quang Trường - Product Management
- Review tài liệu chức năng: phạm vi public/admin, product inactive, delete history.
- Review code: product schema, controller, service, admin/public routes.
- Kiểm thử giao diện: list, search, category filter, detail, admin create.
- Unit test: boundary cho filter price, stock âm, image URL.
- Black-box/API test: create product, inactive visibility, delete product history đều đã có PASS từ automated test.
- Kết quả và đánh giá: module product đủ tốt để dùng cho kiểm thử CRUD + integrity rule.

### 2.3 Hoàng Xuân Thảo - Cart & Checkout
- Review tài liệu chức năng: stock rule, checkout transaction, shipping payload, cart empty.
- Review code: `cart.service.ts`, `order.schema.ts`, `order.service.ts`, `CartPage.tsx`, `CheckoutPage.tsx`.
- Kiểm thử giao diện: cart quantity, total, delete, CTA checkout, shipping form.
- Unit test: gợi ý kiểm tra total formula, transaction rollback, quantity schema.
- Black-box/API test: add cart và checkout success đã có PASS automated.
- Kết quả và đánh giá: backend checkout tốt; UI còn 2 finding hợp lý để nhóm phân tích trong báo cáo.

### 2.4 Ngô Quang Tiến - Order Management
- Review tài liệu chức năng: state machine order và yêu cầu admin/user access.
- Review code: order service, schema, routes, order UI.
- Kiểm thử giao diện: my orders, admin orders, trạng thái, discount hiển thị.
- Unit test: `allows forward transitions` và `rejects invalid backward or terminal transitions` đã PASS.
- Black-box/API test: update status admin đã có PASS automated; các nhánh cancel và invalid status nên retest thủ công.
- Kết quả và đánh giá: module order có business rule rõ nhất, phù hợp để trình bày traceability matrix.

### 2.5 Trần Chí Trung - Voucher & Product Review
- Review tài liệu chức năng: voucher expired/limit/min order, review completed order, duplicate review.
- Review code: voucher service/schema, review service, AdminVouchersPage, checkout voucher preview.
- Kiểm thử giao diện: tạo voucher, apply voucher, review form, trạng thái reviewed.
- Unit test: đề xuất max discount, rating 1-5, duplicate uniqueness.
- Black-box/API test: apply voucher, seed usage consistency, create review, duplicate review, reviewed flag đã có PASS automated.
- Kết quả và đánh giá: backend rule tốt; finding UI còn lại là cách hiển thị lỗi voucher chưa tách ngữ cảnh.

## Phần 3 – Tổng hợp kết quả
- Tổng số test case trong workbook kết quả: `75`.
- Verdict hiện tại:
  - PASS: `14`
  - FAIL: `4`
  - BLOCKED: `0`
  - NOT RUN: `57`
- Tỷ lệ PASS trên các case đã có verdict: `77.8%`.
- Tổng số defect mẫu trong workbook: `10`.
- Phân bố severity defect:
  - Critical: `0`
  - High: `1`
  - Medium: `3`
  - Low: `6`

Đánh giá chất lượng hệ thống:
- Backend đủ hoàn chỉnh để demo và làm báo cáo SQA có chiều sâu.
- Rule nghiệp vụ quan trọng đã có kiểm soát bằng validate, transaction, auth và automated test.
- UI hoạt động đầy đủ cho các luồng chính nhưng vẫn còn vài khoảng trống UX phù hợp để nhóm ghi nhận defect, đề xuất improvement và thực hiện retest.

Bài học rút ra:
- Tài liệu và code cần được rà soát đồng bộ, nhất là khi logic thay đổi sau audit.
- Các case negative thường giúp phát hiện thiếu sót tốt hơn case happy path.
- Evidence Index giúp việc tổng hợp báo cáo nhanh và ít bỏ sót.

Đề xuất cải tiến:
- Tách error state cho voucher và checkout.
- Tự logout hoặc redirect khi token hết hạn.
- Bổ sung frontend validation theo schema backend.
- Bổ sung screenshot/manual test evidence và mở rộng unit test cho schema/service.
