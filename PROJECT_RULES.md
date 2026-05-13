# Project Rules

## Working Agreement
- Moi lan bat dau task moi phai doc `PROJECT_RULES.md` va `PROJECT_MEMORY.md`.
- Khong duoc xoa `PROJECT_RULES.md` va `PROJECT_MEMORY.md`.
- Moi thay doi quan trong phai cap nhat vao `PROJECT_MEMORY.md`.
- Code phai ro rang, de review, co comment khi can.
- Khong duoc dung code obfuscated hoac cach viet qua kho hieu.

## Architecture Rules
- Moi module can co controller/service/model hoac cau truc tuong duong.
- Moi chuc nang chinh can validate du lieu dau vao.
- Moi API can tra ve response thong nhat:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

- Co middleware auth JWT va middleware kiem tra quyen admin.
- Khong hardcode mat khau that, token that, key that.
- Cau hinh bi mat neu co phai dua qua bien moi truong.

## Data And Demo Rules
- Phai co du lieu seed de demo.
- Phai co README huong dan chay.
- Phai co tai lieu phuc vu SQA trong thu muc `docs`.
- Phai co it nhat mot so bug/issue mau duoc ghi trong tai lieu de nhom co noi dung phan tich kiem thu.
- Khong duoc tao project qua don gian kieu CRUD mot bang.

## Quality Rules
- Uu tien logic that, luong nghiep vu ro rang, code de kiem thu.
- Khong de syntax error, import sai, file rong.
- Neu co them tinh nang hoac thay doi nghiep vu, cap nhat tai lieu lien quan va `PROJECT_MEMORY.md`.
