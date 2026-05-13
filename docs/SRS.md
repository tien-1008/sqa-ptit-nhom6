# Software Requirements Specification

## 1. Gioi thieu he thong
`SQA E-commerce Mini System` la website thuong mai dien tu mini phuc vu hoc tap va thuc hanh dam bao chat luong phan mem. He thong co du nghiep vu lien ket de nhom thuc hien review tai lieu, review code, UI test, unit test, black-box test va API test.

## 2. Pham vi
- Quan ly nguoi dung, dang ky, dang nhap, phan quyen.
- Quan ly san pham, danh muc, tim kiem, loc.
- Gio hang, checkout, tao don hang gia lap.
- Quan ly trang thai don hang.
- Voucher khuyen mai.
- Danh gia san pham da mua.
- Khong xu ly thanh toan that, van chuyen that, email/SMS that.

## 3. Actor
- `Guest`: xem danh sach san pham, chi tiet san pham, dang ky, dang nhap.
- `User`: thao tac gio hang, checkout, xem don hang cua minh, review don da hoan thanh.
- `Admin`: CRUD san pham, tao voucher, xem tat ca don, cap nhat trang thai don.

## 4. Chuc nang
### 4.1 Authentication & Authorization
- Dang ky voi email hop le va password dat quy tac.
- Dang nhap va nhan JWT.
- Logout phia client bang cach xoa token local.
- API admin bat buoc role `ADMIN`.

### 4.2 Product Management
- Danh sach va chi tiet san pham active cho khu vuc public.
- Loc theo danh muc, khoang gia, trang thai con hang.
- Tim kiem theo ten/mo ta.
- Admin xem day du san pham active/inactive, them, sua, xoa san pham.

### 4.3 Cart & Checkout
- Them vao gio, cap nhat so luong, xoa khoi gio.
- Tong tien tu dong tinh theo don gia x so luong.
- So luong khong vuot ton kho.
- Checkout tao don `PENDING`, tru kho, clear cart.

### 4.4 Order Management
- User xem don cua chinh minh.
- Admin xem tat ca don.
- Trang thai gom `PENDING`, `CONFIRMED`, `SHIPPING`, `COMPLETED`, `CANCELLED`.
- Khong cho transition sai logic.

### 4.5 Voucher
- Admin tao voucher loai phan tram hoac tien co dinh.
- User ap voucher cho gio hang hoac checkout.
- Kiem tra het han, limit, tong don toi thieu, trang thai active.

### 4.6 Review Product
- User review san pham da mua trong don `COMPLETED`.
- Rating 1-5 va comment.
- Moi cap `order/product/user` chi review mot lan.

## 5. Yeu cau phi chuc nang
- API tra format thong nhat `{ success, message, data }`.
- Response loi phai co thong diep de UI hien thi.
- Database local SQLite, script init/seed chay lai duoc.
- Code chia module de de review.
- Cac luong quan trong co test API mau.
- Password duoc hash, token secret cau hinh qua bien moi truong.
- Giao dien responsive co the demo tren laptop va mobile kich thuoc pho bien.

## 6. Business rules
1. Email phai dung dinh dang email.
2. Password toi thieu 8 ky tu, co chu hoa, chu thuong, chu so.
3. Chuc nang admin can JWT hop le va role `ADMIN`.
4. San pham them vao gio phai dang active va con ton kho.
5. So luong gio va checkout khong duoc vuot ton kho hien tai.
6. Voucher het han, inactive, vuot usage limit hoac khong dat min order value deu bi tu choi.
7. Checkout thanh cong tao order `PENDING`.
8. Order chi chuyen trang thai theo luong hop le.
9. Don da `COMPLETED` hoac `CANCELLED` la trang thai cuoi.
10. Review chi hop le neu san pham nam trong don cua user va don da `COMPLETED`.
11. San pham `INACTIVE` khong xuat hien o API public va trang mua hang.
12. San pham da co order/review history khong duoc hard delete; admin nen chuyen sang `INACTIVE`.

## 7. Use case chinh
### UC-01 Dang nhap
- Actor: Guest
- Preconditions: Co tai khoan hop le.
- Main flow: Nhap email/password, backend xac thuc, tra JWT va thong tin user.
- Alternate flow: Sai credential thi tra loi 401.

### UC-02 Mua hang co voucher
- Actor: User
- Preconditions: Da dang nhap, gio co san pham hop le.
- Main flow: Ap voucher, nhap thong tin giao hang, checkout, he thong tao order va tru kho.
- Alternate flow: Voucher khong hop le hoac ton kho thieu thi checkout that bai.

### UC-03 Cap nhat trang thai don
- Actor: Admin
- Preconditions: Admin dang nhap, order ton tai.
- Main flow: Chon trang thai ke tiep hop le, he thong cap nhat order.
- Alternate flow: Transition sai logic bi tu choi.

### UC-04 Review san pham
- Actor: User
- Preconditions: User co order `COMPLETED` chua review cho san pham do.
- Main flow: Chon rating, nhap comment, gui review.
- Alternate flow: Don chua completed hoac review trung thi bi tu choi.
