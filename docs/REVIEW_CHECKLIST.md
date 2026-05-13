# Review Checklist

## 1. Checklist review tai lieu dac ta
- [ ] Ten he thong, muc tieu va pham vi ro rang.
- [ ] Actor duoc liet ke day du.
- [ ] Moi module co yeu cau chuc nang.
- [ ] Business rule khong mau thuan.
- [ ] Use case co precondition, main flow, alternate flow.
- [ ] Ngoai pham vi duoc neu ro.
- [ ] Yeu cau phi chuc nang co the danh gia.
- [ ] Tai khoan, du lieu demo va gioi han he thong duoc mo ta.

## 2. Checklist review thiet ke/API
- [ ] API naming nhat quan.
- [ ] Method REST phu hop.
- [ ] Auth required duoc xac dinh ro.
- [ ] Request body va response mau day du.
- [ ] Error code phu hop cho validation, auth, conflict.
- [ ] API admin duoc tach bach.
- [ ] Luong voucher/checkout/order transition duoc mo ta.
- [ ] Database quan he phu hop nghiep vu.

## 3. Checklist review code
- [ ] Module co cau truc controller/service/model hoac tuong duong.
- [ ] Validation request duoc dung o route.
- [ ] Middleware auth/admin duoc dung dung vi tri.
- [ ] Khong hardcode secret that.
- [ ] Transaction checkout ro rang.
- [ ] Error handler gom loi ve format chung.
- [ ] Query SQL co tham so, khong noi chuoi tu input.
- [ ] Test mau cover luong co rui ro cao.
- [ ] Code co ten bien/ham ro nghia.
- [ ] Khong co import sai, file rong, logic bo do.

## 4. Checklist bao mat co ban
- [ ] Password duoc hash.
- [ ] JWT secret lay tu env.
- [ ] User thuong khong goi duoc API admin.
- [ ] Backend khong tra ve password hash.
- [ ] Validation email/password bat buoc.
- [ ] Loi xac thuc khong ro ri thong tin nhay cam.
- [ ] Khong co token/key that trong repo.
- [ ] Cac input chu yeu deu validate.

## 5. Checklist UI/UX co ban
- [ ] Form hien thi loi validate.
- [ ] Button disabled khi thao tac khong hop le ro rang.
- [ ] Admin va user thay menu khac nhau.
- [ ] Gio hang de cap nhat/xoa.
- [ ] Checkout hien subtotal va preview voucher.
- [ ] Trang admin co thao tac CRUD/transition co the demo.
- [ ] Text khong tran khoi container o man hinh nho.
- [ ] Bang co scroll ngang khi can.
