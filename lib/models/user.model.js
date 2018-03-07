const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require( 'bcrypt' );

const UserSchema = new Schema({
  email: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
  country: { type: String },
  admin: { type: Boolean }
});

const saltRounds = 10;

UserSchema.methods.setPassword = function(passwd) {
  this.password = bcrypt.hashSync(passwd, saltRounds);
};

UserSchema.methods.comparePassword = function(passwd) {
  return bcrypt.compareSync(passwd, this.password);
};

module.exports = mongoose.model('User', UserSchema);
