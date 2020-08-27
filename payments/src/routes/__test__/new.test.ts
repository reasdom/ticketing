import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns 404 whrn order not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "asdf", orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it("returns 401 when order not belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdf",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 when pay for a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "asdf",
      orderId: order.id,
    })
    .expect(400);
});
// pk_test_51HKepdECp4JiiffRd5Q7upPVwDasPYnXRUECAXMw400gAyJ63a3y7qJUlDsmoE71jbvjrieOBiSGyCKGpmbw0kWm00u7neSwNO
// sk_test_51HKepdECp4JiiffRyqCNFQgB5I9p3cnDWmRVnMSTAnTW2RJ3Y3hGJOx1r7f65wGza8M7PKeYcbo1BGZbfjpJDLtH00bVk7pGCF

it("returns a 204 with valid input", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
