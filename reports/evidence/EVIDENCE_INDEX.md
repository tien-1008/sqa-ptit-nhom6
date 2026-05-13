# Evidence Index

Generated on: 2026-05-13

## Screenshots
- `screenshots/products-list.png`: Public product list.
- `screenshots/auth-login-page.png`: Login page.
- `screenshots/auth-register-page.png`: Register page.
- `screenshots/user-orders.png`: User order page after authenticated session.
- `screenshots/admin-products.png`: Admin product management page.
- `screenshots/admin-vouchers.png`: Admin voucher management page.
- `screenshots/BUG-05.png`: Cart page evidence for empty-cart checkout CTA review.
- `screenshots/BUG-06.png`: Checkout page evidence for shipping validation review.
- `screenshots/BUG-07.png`: Checkout voucher area evidence.
- `screenshots/BUG-08.png`: Authentication/session evidence screenshot.
- `screenshots/BUG-10.png`: Admin order status display evidence.

## Unit Test Evidence
- `unit-test-result/backend-vitest-result.txt`: Full backend Vitest output.
- `unit-test-result/ORD-TC-11.txt`: Order transition unit test evidence pointer.
- `unit-test-result/order-status-unit-test-result.txt`: Order status unit test summary.

## API Test Evidence
- `api-test-result/backend-supertest-result.txt`: Full backend Supertest/Vitest API output.
- `api-test-result/api-smoke-result.json`: API smoke result for health, product/category counts, user login and admin login.
- `api-test-result/AUTH-TC-06.txt`: Login test evidence pointer.
- `api-test-result/PROD-TC-06.txt`: Create product test evidence pointer.
- `api-test-result/CART-TC-07.txt`: Checkout test evidence pointer.
- `api-test-result/VR-TC-09.txt`: Duplicate review test evidence pointer.

## Excel Evidence Path Audit
- `excel-evidence-audit-before.json`: Audit before fixing workbook evidence references.
- `excel-evidence-created-aliases.json`: List of evidence alias/pointer files created to match Excel paths.
- `excel-evidence-audit-after.json`: Final audit result. `85` Excel evidence references checked, `0` missing.
- Workbook 01 and 02 do not contain per-test evidence path columns.
- Workbook 03 contains all `85` evidence references, and every referenced file now exists.

## Notes
- The screenshots were captured from the local React frontend with backend seed data.
- Backend automated tests passed `12/12` at the time of evidence generation.
- Some `AUTH-TC-*`, `PROD-TC-*`, `CART-TC-*`, `ORD-TC-*`, `VR-TC-*`, and `BUG-*` files are alias/pointer evidence files so that the exact path written in Excel resolves to a real screenshot or log artifact.
- `source-code-link.md` still needs the official Git URL before submission.
