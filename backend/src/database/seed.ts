import bcrypt from "bcryptjs";
import type Database from "better-sqlite3";

export function seedDemoData(db: Database.Database): void {
  const transaction = db.transaction(() => {
    db.exec(`
      DELETE FROM reviews;
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM cart_items;
      DELETE FROM vouchers;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM users;
      DELETE FROM sqlite_sequence;
    `);

    const insertUser = db.prepare(`
      INSERT INTO users (email, name, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);

    insertUser.run(
      "admin@example.com",
      "System Admin",
      bcrypt.hashSync("Admin@123", 10),
      "ADMIN"
    );
    insertUser.run(
      "user@example.com",
      "Demo Customer",
      bcrypt.hashSync("User@123", 10),
      "USER"
    );

    const insertCategory = db.prepare(`
      INSERT INTO categories (name, slug)
      VALUES (?, ?)
    `);

    const categories = [
      ["Laptop", "laptop"],
      ["Phone", "phone"],
      ["Accessory", "accessory"],
      ["Home Office", "home-office"]
    ];
    categories.forEach((category) => insertCategory.run(category[0], category[1]));

    const insertProduct = db.prepare(`
      INSERT INTO products (
        category_id, name, slug, description, price, stock, status, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const products = [
      [
        1,
        "QA Workstation 14",
        "qa-workstation-14",
        "Laptop gon nhe cho kiem thu web, viet test case va demo automation.",
        18990000,
        8,
        "ACTIVE",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
      ],
      [
        1,
        "Automation Laptop Pro",
        "automation-laptop-pro",
        "May cau hinh cao cho build TypeScript, chay API test va report.",
        25990000,
        5,
        "ACTIVE",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
      ],
      [
        2,
        "Traceability Phone X",
        "traceability-phone-x",
        "Dien thoai demo cho cac kich ban mua hang va test responsive UI.",
        12990000,
        12,
        "ACTIVE",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
      ],
      [
        3,
        "Mechanical Keyboard QA",
        "mechanical-keyboard-qa",
        "Ban phim co danh cho reviewer viet checklist va bug report dai.",
        1590000,
        20,
        "ACTIVE",
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a"
      ],
      [
        3,
        "USB-C Hub 7 Ports",
        "usb-c-hub-7-ports",
        "Hub ket noi demo cac luong nhap xuat san pham va filter ton kho.",
        890000,
        0,
        "ACTIVE",
        "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9"
      ],
      [
        4,
        "Ergonomic Test Chair",
        "ergonomic-test-chair",
        "Ghe lam viec cho buoi review tai lieu va kiem thu hoi quy.",
        3490000,
        4,
        "ACTIVE",
        "https://images.unsplash.com/photo-1505843490701-5be5d7b9601b"
      ]
    ];

    products.forEach((product) => insertProduct.run(...product));

    const insertVoucher = db.prepare(`
      INSERT INTO vouchers (
        code, description, discount_type, discount_value, max_discount,
        min_order_value, usage_limit, used_count, expires_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVoucher.run(
      "WELCOME10",
      "Giam 10% cho don tu 500,000 VND.",
      "PERCENT",
      10,
      500000,
      500000,
      100,
      1,
      "2030-12-31T23:59:59.000Z",
      1
    );
    insertVoucher.run(
      "FIXED50",
      "Giam 50,000 VND cho don tu 300,000 VND.",
      "FIXED",
      50000,
      null,
      300000,
      50,
      0,
      "2030-12-31T23:59:59.000Z",
      1
    );
    insertVoucher.run(
      "EXPIRED20",
      "Voucher mau da het han de test negative case.",
      "PERCENT",
      20,
      200000,
      100000,
      10,
      0,
      "2024-01-01T00:00:00.000Z",
      1
    );

    const insertOrder = db.prepare(`
      INSERT INTO orders (
        user_id, voucher_id, status, total_amount, discount_amount, final_amount,
        shipping_name, shipping_phone, shipping_address, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const completedOrder = insertOrder.run(
      2,
      null,
      "COMPLETED",
      1590000,
      0,
      1590000,
      "Demo Customer",
      "0900000001",
      "01 SQA Street, District 1, Ho Chi Minh City",
      "MOCK"
    );

    const pendingOrder = insertOrder.run(
      2,
      1,
      "PENDING",
      18990000,
      500000,
      18490000,
      "Demo Customer",
      "0900000001",
      "01 SQA Street, District 1, Ho Chi Minh City",
      "MOCK"
    );

    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, unit_price, quantity, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertOrderItem.run(
      Number(completedOrder.lastInsertRowid),
      4,
      "Mechanical Keyboard QA",
      1590000,
      1,
      1590000
    );
    insertOrderItem.run(
      Number(pendingOrder.lastInsertRowid),
      1,
      "QA Workstation 14",
      18990000,
      1,
      18990000
    );
  });

  transaction();
}
