# Test Cases

## 1. Authentication & Authorization
| ID | Module | Test scenario | Preconditions | Steps | Test data | Expected result | Actual result | Status | Note |
|---|---|---|---|---|---|---|---|---|---|
| AUTH-01 | Auth | Dang nhap user hop le | Seed data san sang | Goi login | `user@example.com/User@123` | 200, co JWT, role USER | Chua chay | Not Run | Pass case |
| AUTH-02 | Auth | Dang nhap admin hop le | Seed data san sang | Goi login | `admin@example.com/Admin@123` | 200, role ADMIN | Chua chay | Not Run | Pass case |
| AUTH-03 | Auth | Sai mat khau | User ton tai | Goi login | `user@example.com/Wrong123` | 401, success false | Chua chay | Not Run | Fail case |
| AUTH-04 | Auth | Dang ky email sai dinh dang | Khong | Submit register | `abc`, `User@1234` | 400 validation failed | Chua chay | Not Run | Fail case |
| AUTH-05 | Auth | Dang ky password khong du manh | Khong | Submit register | `new@example.com/12345678` | 400 validation failed | Chua chay | Not Run | Fail case |
| AUTH-06 | Auth | Dang ky email trung | Seed user da co | Submit register | `user@example.com` | 409 duplicate email | Chua chay | Not Run | Fail case |
| AUTH-07 | AuthZ | Goi admin API khong token | Khong | POST product admin | Product payload | 401 auth required | Chua chay | Not Run | Security |
| AUTH-08 | AuthZ | User thuong goi admin API | User token hop le | POST product admin | Product payload | 403 admin required | Chua chay | Not Run | Security |

## 2. Product Management
| ID | Module | Test scenario | Preconditions | Steps | Test data | Expected result | Actual result | Status | Note |
|---|---|---|---|---|---|---|---|---|---|
| PROD-01 | Product | Xem danh sach san pham | Seed data | GET products | None | 200, danh sach > 0 | Chua chay | Not Run | Pass |
| PROD-02 | Product | Tim theo tu khoa | Seed data | GET products co query | `search=Keyboard` | Ket qua co san pham lien quan | Chua chay | Not Run | Search |
| PROD-03 | Product | Loc con hang | Seed data | GET query | `inStock=true` | Khong co stock = 0 | Chua chay | Not Run | Filter |
| PROD-04 | Product | Loc gia sai boundary | Seed data | GET query | `minPrice=5000000,maxPrice=1000000` | 400 validation failed | Chua chay | Not Run | Fail |
| PROD-05 | Product | Xem chi tiet khong ton tai | Khong | GET product detail | `9999` | 404 not found | Chua chay | Not Run | Fail |
| PROD-06 | Product | Admin tao san pham hop le | Admin token | POST admin product | Payload hop le | 201 created | Chua chay | Not Run | Pass |
| PROD-07 | Product | Admin tao san pham category sai | Admin token | POST admin product | `categoryId=999` | 404 category missing | Chua chay | Not Run | Fail |
| PROD-08 | Product | Admin sua stock va gia | Admin token, product ton tai | PATCH product | `stock=3, price=990000` | 200 updated | Chua chay | Not Run | Update |
| PROD-09 | Product | Public khong thay san pham inactive, admin van thay | Admin token | Tao product `INACTIVE`, goi public/admin list | Product inactive | Public ẩn, admin list co | Chua chay | Not Run | Authorization + visibility |
| PROD-10 | Product | Xoa product da co order history | Admin token, product da mua | DELETE product | Product 4 seed | 409, khong tra 500 | Chua chay | Not Run | Data integrity |

## 3. Cart & Checkout
| ID | Module | Test scenario | Preconditions | Steps | Test data | Expected result | Actual result | Status | Note |
|---|---|---|---|---|---|---|---|---|---|
| CART-01 | Cart | Them san pham hop le vao gio | User token, stock du | POST cart item | `productId=1, quantity=1` | 201, item vao gio | Chua chay | Not Run | Pass |
| CART-02 | Cart | Them so luong vuot ton | User token | POST cart item | `productId=1, quantity=99` | 409 stock exceeded | Chua chay | Not Run | Fail |
| CART-03 | Cart | Cap nhat so luong hop le | Cart da co item | PATCH quantity | `quantity=2` | 200, total cap nhat | Chua chay | Not Run | Pass |
| CART-04 | Cart | Cap nhat so luong = 0 | Cart da co item | PATCH quantity | `quantity=0` | 400 validation failed | Chua chay | Not Run | Fail |
| CART-05 | Cart | Xoa item khoi gio | Cart da co item | DELETE item | `productId=1` | 200, item bien mat | Chua chay | Not Run | Pass |
| CART-06 | Checkout | Checkout khi gio trong | User token, gio rong | POST checkout | Shipping hop le | 409 cart empty | Chua chay | Not Run | Fail |
| CART-07 | Checkout | Checkout hop le khong voucher | Cart co item | POST checkout | Shipping hop le | 201 order PENDING, cart rong | Chua chay | Not Run | Pass |
| CART-08 | Checkout | Checkout voucher hop le | Cart dat min order | POST checkout | `voucherCode=WELCOME10` | Discount dung, final amount dung | Chua chay | Not Run | Pass |

## 4. Order Management
| ID | Module | Test scenario | Preconditions | Steps | Test data | Expected result | Actual result | Status | Note |
|---|---|---|---|---|---|---|---|---|---|
| ORD-01 | Order | User xem don cua minh | User token | GET mine | None | Chi tra don cua user do | Chua chay | Not Run | Access |
| ORD-02 | Order | Goi mine khong token | Khong | GET mine | None | 401 | Chua chay | Not Run | Fail |
| ORD-03 | Order | Admin xem tat ca don | Admin token | GET admin orders | None | 200, co order | Chua chay | Not Run | Pass |
| ORD-04 | Order | User thuong xem tat ca don | User token | GET admin orders | None | 403 | Chua chay | Not Run | Fail |
| ORD-05 | Order | PENDING -> CONFIRMED | Admin token, order PENDING | PATCH status | `CONFIRMED` | 200 updated | Chua chay | Not Run | Transition |
| ORD-06 | Order | CONFIRMED -> SHIPPING | Admin token | PATCH status | `SHIPPING` | 200 updated | Chua chay | Not Run | Transition |
| ORD-07 | Order | COMPLETED -> PENDING bi chan | Admin token, order completed | PATCH status | `PENDING` | 409 invalid transition | Chua chay | Not Run | Fail |
| ORD-08 | Order | Cancel order hop le | Admin token, order PENDING | PATCH status | `CANCELLED` | 200, status cancelled | Chua chay | Not Run | Pass |

## 5. Voucher / Discount
| ID | Module | Test scenario | Preconditions | Steps | Test data | Expected result | Actual result | Status | Note |
|---|---|---|---|---|---|---|---|---|---|
| VOU-01 | Voucher | Admin tao voucher percent hop le | Admin token | POST admin voucher | Percent 15 | 201 created | Chua chay | Not Run | Pass |
| VOU-02 | Voucher | Admin tao voucher code trung | Admin token, WELCOME10 da co | POST admin voucher | `WELCOME10` | 409 duplicate | Chua chay | Not Run | Fail |
| VOU-03 | Voucher | Tao percent > 100 | Admin token | POST voucher | `discountValue=120` | 400 validation failed | Chua chay | Not Run | Fail |
| VOU-04 | Voucher | Apply voucher hop le | User token, cart dat min | POST apply | `WELCOME10` | 200, discount dung | Chua chay | Not Run | Pass |
| VOU-05 | Voucher | Apply voucher khong ton tai | User token, cart co item | POST apply | `NOTFOUND` | 404 | Chua chay | Not Run | Fail |
| VOU-06 | Voucher | Apply voucher het han | User token, cart co item | POST apply | `EXPIRED20` | 409 expired | Chua chay | Not Run | Fail |
| VOU-07 | Voucher | Apply voucher khi cart duoi min | User token, cart gia thap | POST apply | `WELCOME10` | 409 min order not reached | Chua chay | Not Run | Fail |
| VOU-08 | Voucher | Final amount khong am | User token, cart co item | Apply fixed discount | `FIXED50` | Discount <= subtotal | Chua chay | Not Run | Boundary |

## 6. Product Review
| ID | Module | Test scenario | Preconditions | Steps | Test data | Expected result | Actual result | Status | Note |
|---|---|---|---|---|---|---|---|---|---|
| REV-01 | Review | Review san pham da mua va order completed | User token, seed completed order | POST review | order 1, product 4, rating 5 | 201 created | Chua chay | Not Run | Pass |
| REV-02 | Review | Review order khong thuoc user | User token | POST review | order nguoi khac | 404 | Chua chay | Not Run | Fail |
| REV-03 | Review | Review don chua completed | User token, order pending | POST review | pending order | 409 | Chua chay | Not Run | Fail |
| REV-04 | Review | Review product khong nam trong order | User token, completed order | POST review | product khac | 409 | Chua chay | Not Run | Fail |
| REV-05 | Review | Rating = 0 | User token | POST review | `rating=0` | 400 validation failed | Chua chay | Not Run | Fail |
| REV-06 | Review | Rating = 5 | User token | POST review | `rating=5` | 201 neu dieu kien dung | Chua chay | Not Run | Boundary |
| REV-07 | Review | Gui trung review cung order/product | Review da tao | POST lai | Giong lan truoc | 409 duplicate | Chua chay | Not Run | Fail |
| REV-08 | Review | Xem danh sach review cua product | Review ton tai | GET product reviews | `productId=4` | 200, co review | Chua chay | Not Run | Pass |
| REV-09 | Review | Don hang mine danh dau item da review | Review da tao | GET orders mine | Order 1/product 4 | `items[].reviewed=true` | Chua chay | Not Run | UI support |
