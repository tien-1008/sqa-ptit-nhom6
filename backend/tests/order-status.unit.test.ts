import { describe, expect, it } from "vitest";
import { canTransitionOrderStatus } from "../src/modules/orders/order.service.js";

describe("order status transition rules", () => {
  it("allows forward transitions", () => {
    expect(canTransitionOrderStatus("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransitionOrderStatus("CONFIRMED", "SHIPPING")).toBe(true);
    expect(canTransitionOrderStatus("SHIPPING", "COMPLETED")).toBe(true);
  });

  it("rejects invalid backward or terminal transitions", () => {
    expect(canTransitionOrderStatus("COMPLETED", "PENDING")).toBe(false);
    expect(canTransitionOrderStatus("CANCELLED", "CONFIRMED")).toBe(false);
    expect(canTransitionOrderStatus("PENDING", "COMPLETED")).toBe(false);
  });
});
