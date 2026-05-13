import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { getDb } from "../src/config/database.js";
import { initializeSchema } from "../src/database/schema.js";
import { seedDemoData } from "../src/database/seed.js";

beforeEach(() => {
  const db = getDb();
  initializeSchema(db);
  seedDemoData(db);
});

async function login(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token as string;
}

describe("SQA e-commerce API flows", () => {
  it("logs in with seeded user credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "User@123"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.role).toBe("USER");
    expect(response.body.data.token).toBeTypeOf("string");
  });

  it("creates a product for admin", async () => {
    const token = await login("admin@example.com", "Admin@123");
    const response = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryId: 3,
        name: "Regression Mouse",
        description: "Mouse demo de kiem thu thao tac them sua xoa san pham.",
        price: 650000,
        stock: 9,
        status: "ACTIVE",
        imageUrl: ""
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Regression Mouse");
  });

  it("keeps inactive products out of public routes while admin can still list them", async () => {
    const token = await login("admin@example.com", "Admin@123");
    const created = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryId: 3,
        name: "Hidden Audit Device",
        description: "San pham inactive dung de kiem tra phan tach public/admin.",
        price: 720000,
        stock: 3,
        status: "INACTIVE",
        imageUrl: ""
      });

    const productId = created.body.data.id as number;
    const publicList = await request(app).get("/api/products");
    const publicDetail = await request(app).get(`/api/products/${productId}`);
    const publicReviews = await request(app).get(`/api/products/${productId}/reviews`);
    const adminList = await request(app)
      .get("/api/admin/products")
      .set("Authorization", `Bearer ${token}`);

    expect(created.status).toBe(201);
    expect(publicList.body.data.some((product: { id: number }) => product.id === productId)).toBe(
      false
    );
    expect(publicDetail.status).toBe(404);
    expect(publicReviews.status).toBe(404);
    expect(adminList.body.data.some((product: { id: number }) => product.id === productId)).toBe(
      true
    );
  });

  it("adds a product to cart", async () => {
    const token = await login("user@example.com", "User@123");
    const response = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: 1, quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body.data.items[0].quantity).toBe(2);
    expect(response.body.data.totalAmount).toBe(37980000);
  });

  it("applies a voucher against the current cart", async () => {
    const token = await login("user@example.com", "User@123");
    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: 4, quantity: 1 });

    const response = await request(app)
      .post("/api/vouchers/apply")
      .set("Authorization", `Bearer ${token}`)
      .send({ code: "WELCOME10" });

    expect(response.status).toBe(200);
    expect(response.body.data.discountAmount).toBe(159000);
    expect(response.body.data.finalAmount).toBe(1431000);
  });

  it("keeps seeded voucher usage aligned with the seeded discounted order", async () => {
    const token = await login("admin@example.com", "Admin@123");
    const response = await request(app)
      .get("/api/admin/vouchers")
      .set("Authorization", `Bearer ${token}`);
    const welcomeVoucher = response.body.data.find(
      (voucher: { code: string }) => voucher.code === "WELCOME10"
    );

    expect(response.status).toBe(200);
    expect(welcomeVoucher.usedCount).toBe(1);
  });

  it("checks out a cart and creates an order", async () => {
    const token = await login("user@example.com", "User@123");
    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: 4, quantity: 1 });

    const response = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingName: "Demo Customer",
        shippingPhone: "0900000001",
        shippingAddress: "99 Quality Avenue, Ho Chi Minh City",
        voucherCode: "WELCOME10"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("PENDING");
    expect(response.body.data.finalAmount).toBe(1431000);
    expect(response.body.data.items).toHaveLength(1);
  });

  it("updates order status through the allowed admin transition", async () => {
    const userToken = await login("user@example.com", "User@123");
    const checkout = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId: 4, quantity: 1 });

    expect(checkout.status).toBe(201);

    const order = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        shippingName: "Demo Customer",
        shippingPhone: "0900000001",
        shippingAddress: "99 Quality Avenue, Ho Chi Minh City"
      });

    const adminToken = await login("admin@example.com", "Admin@123");
    const response = await request(app)
      .patch(`/api/admin/orders/${order.body.data.id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "CONFIRMED" });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("CONFIRMED");
  });

  it("rejects deleting products that already have order history", async () => {
    const token = await login("admin@example.com", "Admin@123");
    const response = await request(app)
      .delete("/api/admin/products/4")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("cannot be deleted");
  });

  it("marks reviewed order items and blocks duplicate product reviews", async () => {
    const token = await login("user@example.com", "User@123");
    const created = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: 1,
        productId: 4,
        rating: 5,
        comment: "Review duoc tao tu bo API test."
      });
    const mine = await request(app)
      .get("/api/orders/mine")
      .set("Authorization", `Bearer ${token}`);
    const duplicate = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: 1,
        productId: 4,
        rating: 5,
        comment: "Gui lai review trung."
      });

    const completedOrder = mine.body.data.find((order: { id: number }) => order.id === 1);
    const reviewedItem = completedOrder.items.find(
      (item: { productId: number }) => item.productId === 4
    );

    expect(created.status).toBe(201);
    expect(reviewedItem.reviewed).toBe(true);
    expect(duplicate.status).toBe(409);
  });
});
