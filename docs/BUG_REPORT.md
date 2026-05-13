# Bug Report Mau

> Tai lieu nay gom defect/issue mau phuc vu phan tich SQA. Cac finding duoi day da duoc ghi nhan trong vong review/test va co trang thai sau dot audit cuoi.

| ID | Tieu de | Severity | Priority | Trang thai |
|---|---|---|---|---|
| BUG-01 | Xoa san pham da tung xuat hien trong order co the tra loi server error | High | High | Resolved |
| BUG-02 | San pham `INACTIVE` van co the hien tren danh sach cong khai | Medium | Medium | Resolved |
| BUG-03 | Review form van hien sau khi user gui review thanh cong | Low | Medium | Resolved |
| BUG-04 | Chua co confirm dialog truoc khi admin xoa san pham | Low | Low | Resolved |

## BUG-01
- Module: Product Management
- Severity: High
- Priority: High
- Steps to reproduce:
  1. Dang nhap admin.
  2. Chon san pham da tung nam trong `order_items`.
  3. Bam nut xoa.
- Expected: He thong tu choi xoa voi thong bao nghiep vu de hieu hoac cho phep soft delete.
- Actual: Co kha nang SQLite foreign key nem loi va backend tra loi 500.
- Suggestion: Doi sang soft delete, hoac bat loi constraint va tra response 409 co thong diep ro.
- Resolution: Backend kiem tra order/review history truoc khi delete va tra `409` voi thong diep nghiep vu.

## BUG-02
- Module: Product Management
- Severity: Medium
- Priority: Medium
- Steps to reproduce:
  1. Admin dat mot san pham `INACTIVE`.
  2. Mo trang danh sach san pham cong khai.
- Expected: San pham inactive duoc an hoac co quy tac hien thi ro.
- Actual: API list hien san pham inactive neu khong filter rieng.
- Suggestion: Them rule public list chi hien `ACTIVE`, admin list co endpoint rieng.
- Resolution: Public list/detail chi hien `ACTIVE`; them `GET /api/admin/products` de admin xem day du.

## BUG-03
- Module: Product Review
- Severity: Low
- Priority: Medium
- Steps to reproduce:
  1. Dang nhap user da co order `COMPLETED`.
  2. Gui review hop le.
  3. Quan sat khu vuc review tren trang order.
- Expected: Form duoc an, khoa, hoac doi sang trang thai da review.
- Actual: Form van con, neu gui lai se nhan loi duplicate tu backend.
- Suggestion: Reload order/review state hoac tracking reviewed item tren UI.
- Resolution: `GET /api/orders/mine` tra co `items[].reviewed`; frontend reload order sau khi review va an form da danh gia.

## BUG-04
- Module: Admin Product UI
- Severity: Low
- Priority: Low
- Steps to reproduce:
  1. Dang nhap admin.
  2. Bam icon xoa san pham.
- Expected: Co hop thoai xac nhan truoc thao tac pha huy.
- Actual: UI gui delete request ngay.
- Suggestion: Them confirm dialog va mo ta he qua.
- Resolution: UI admin them confirm truoc khi gui delete request.
