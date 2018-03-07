const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const OrderEntrySchema = new Schema({
  product: { type: ObjectId, required: true, ref: 'Product' },
  productSize: { type: String, required: true },
  productColor: { type: String, required: true},
  quantity: { type: Number }
});

const OrderCustomerSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});

const OrderSchema = new Schema({
  customer: { type: OrderCustomerSchema, required: true },
  entries: { type: [OrderEntrySchema], required: true },
  totalPrice: { type: Number, required: true },
  paymentId: { type: String },
  status: { type: String, required: true }
});

module.exports = {
  OrderEntry: mongoose.model('OrderEntry', OrderEntrySchema),
  OrderCustomer: mongoose.model('OrderCustomer', OrderCustomerSchema),
  Order: mongoose.model('Order', OrderSchema)
};
