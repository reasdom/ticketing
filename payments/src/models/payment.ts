import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymenttModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

interface PaymentDoc extends mongoose.Document {
  version: number;
  orderId: string;
  stripeId: string;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

PaymentSchema.set("versionKey", "version");
PaymentSchema.plugin(updateIfCurrentPlugin);

PaymentSchema.pre("save", async function (done) {
  done();
});

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    _id: attrs.orderId,
    stripeId: attrs.stripeId,
    orderId: attrs.orderId,
    version: 0,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymenttModel>(
  "Payment",
  PaymentSchema
);

export { Payment };
