# Test Plan

## 1. Muc tieu kiem thu
- Xac nhan cac module chinh hoat dong dung yeu cau.
- Phat hien defect o validation, business rule, authorization va UI workflow.
- Tao bang chung phuc vu bao cao mon SQA.

## 2. Pham vi kiem thu
- Authentication & Authorization
- Product Management
- Cart & Checkout
- Order Management
- Voucher / Discount
- Product Review
- API contract va response format
- UI cac man user/admin

## 3. Ngoai pham vi
- Thanh toan that.
- Tich hop ben thu ba.
- Load test quy mo lon.
- Penetration test chuyen sau.
- Gui email/SMS.

## 4. Moi truong kiem thu
- OS: Windows 10/11 hoac moi truong tuong duong.
- Backend: Node.js LTS, Express TypeScript.
- Frontend: React + Vite TypeScript.
- Database: SQLite local file.
- Browser: Chrome/Edge moi.
- Cong cu: VSCode terminal, Vitest, Supertest, Postman hoac curl neu can.

## 5. Nhan su
- Nguyễn Huy Trường: Auth/AuthZ, review SRS auth, test login/register/admin guard.
- Hồ Quang Trường: Product, review API product, UI filtering, CRUD admin.
- Hoàng Xuân Thảo: Cart/Checkout, black-box so luong/tong tien/checkout.
- Ngô Quang Tiến: Order, transition test, review logic state machine.
- Trần Chí Trung: Voucher/Review, negative test va defect analysis.

## 6. Lich kiem thu gia dinh
| Moc | Noi dung |
|---|---|
| Ngay 1 | Review SRS, checklist tai lieu |
| Ngay 2 | Review API/database, chuan hoa test data |
| Ngay 3 | Unit/API test backend |
| Ngay 4 | UI test va black-box test theo module |
| Ngay 5 | Retest, bug report, tong hop ket qua |

## 7. Loai kiem thu
- UI test: layout, form, thong bao loi, phan quyen UI.
- Unit test: order transition, service business rules co the mo rong.
- Black-box test: test case dau vao/ket qua ma khong dua vao code.
- API test: login, product creation, cart, voucher, checkout, order status.

## 8. Tieu chi pass/fail
### Pass
- Test case co actual result trung expected result.
- API dung status code va response format.
- UI hien thi loi hop ly va khong vo layout.
- Cac business rule chinh duoc ton trong.

### Fail
- Sai expected result.
- Khong chan truy cap trai phep.
- Loi 500 cho case nguoi dung co the gay ra.
- Sai tong tien, sai discount, sai ton kho hoac sai order transition.

## 9. Dieu kien vao/ra
### Entry criteria
- Source code build duoc.
- Database seed duoc.
- Tai khoan mau dang nhap duoc.
- Test case da review toi thieu lan dau.

### Exit criteria
- Cac test muc uu tien cao da chay.
- Defect severity cao da duoc ghi nhan.
- Co ket qua test va bang tong hop phuc vu bao cao.

## 10. Rui ro
- Dependency native cua SQLite co the can compiler/prebuilt binary.
- Moi truong Node khac version co the tao sai lech.
- Frontend va backend chay sai port lam CORS/request fail.
- Test data bi thay doi trong khi demo.
- Mot so bug mau co the la gioi han co chu dich de phuc vu phan tich SQA.
