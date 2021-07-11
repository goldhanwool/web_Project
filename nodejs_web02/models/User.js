const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, require: true },
  nickname: { type: String, require: true },
  password: { type: String, require: true },
  conformPassword: { type: String, require: true }
}, { timnestamps: true });

// UserSchema.virtual("userId").get(function () {
//   return this._id.toHexString();
// });
// UserSchema.set("toJSON", {
//   virtuals: true,
// });

const User = model("User", UserSchema); 
module.exports = { User }