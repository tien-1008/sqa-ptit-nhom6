# Database Design

## 1. Bang `users`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| email | TEXT UNIQUE | Email dang nhap |
| name | TEXT | Ten hien thi |
| password_hash | TEXT | Mat khau da hash |
| role | TEXT | `USER` hoac `ADMIN` |
| created_at | TEXT | Thoi diem tao |

## 2. Bang `categories`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| name | TEXT UNIQUE | Ten danh muc |
| slug | TEXT UNIQUE | Dung cho dieu huong/SEO demo |

## 3. Bang `products`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| category_id | INTEGER FK | Tham chieu `categories.id` |
| name | TEXT | Ten san pham |
| slug | TEXT UNIQUE | Dinh danh than thien |
| description | TEXT | Mo ta |
| price | INTEGER | Gia VND |
| stock | INTEGER | Ton kho |
| status | TEXT | `ACTIVE` / `INACTIVE` |
| image_url | TEXT nullable | Anh demo |
| created_at | TEXT | Tao |
| updated_at | TEXT | Cap nhat |

## 4. Bang `cart_items`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| user_id | INTEGER FK | Chu gio |
| product_id | INTEGER FK | San pham |
| quantity | INTEGER | So luong > 0 |
| created_at | TEXT | Tao |

Unique constraint: `(user_id, product_id)`.

## 5. Bang `vouchers`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| code | TEXT UNIQUE | Ma voucher |
| description | TEXT | Mo ta |
| discount_type | TEXT | `PERCENT` / `FIXED` |
| discount_value | INTEGER | Gia tri giam |
| max_discount | INTEGER nullable | Tran giam |
| min_order_value | INTEGER | Gia tri don toi thieu |
| usage_limit | INTEGER | Gioi han dung |
| used_count | INTEGER | So lan da dung |
| expires_at | TEXT | Han dung ISO datetime |
| is_active | INTEGER | 0/1 |
| created_at | TEXT | Tao |

## 6. Bang `orders`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| user_id | INTEGER FK | Chu don |
| voucher_id | INTEGER nullable FK | Voucher da dung |
| status | TEXT | Trang thai order |
| total_amount | INTEGER | Tong truoc discount |
| discount_amount | INTEGER | So tien giam |
| final_amount | INTEGER | Tong sau discount |
| shipping_name | TEXT | Nguoi nhan |
| shipping_phone | TEXT | Dien thoai |
| shipping_address | TEXT | Dia chi |
| payment_method | TEXT | `MOCK` |
| created_at | TEXT | Tao |

## 7. Bang `order_items`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| order_id | INTEGER FK | Don hang |
| product_id | INTEGER FK | San pham |
| product_name | TEXT | Snapshot ten san pham |
| unit_price | INTEGER | Don gia tai thoi diem mua |
| quantity | INTEGER | So luong |
| subtotal | INTEGER | Don gia x so luong |

## 8. Bang `reviews`
| Cot | Kieu | Mo ta |
|---|---|---|
| id | INTEGER PK | Khoa chinh |
| user_id | INTEGER FK | Nguoi review |
| order_id | INTEGER FK | Don lien quan |
| product_id | INTEGER FK | San pham |
| rating | INTEGER | 1-5 |
| comment | TEXT | Noi dung |
| created_at | TEXT | Tao |

Unique constraint: `(user_id, order_id, product_id)`.

## 9. Quan he bang
- Mot user co nhieu cart item, order, review.
- Mot category co nhieu product.
- Mot order co nhieu order item.
- Mot voucher co the gan voi nhieu order.
- Mot product co the xuat hien o cart item, order item va review.

## 10. Business rule lien quan database
- Foreign key bat tren SQLite.
- Checkout dung transaction de tranh tru kho do dang.
- `stock >= 0`, `quantity > 0`, `rating BETWEEN 1 AND 5`.
- Order status chi nam trong tap cho phep.
- Voucher usage count khong am.
