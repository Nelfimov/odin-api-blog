/* eslint-disable no-unused-vars */
/* eslint-disable no-invalid-this */
import {model, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false},
});

// UserSchema.methods.validatePassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

const User = model('User', UserSchema);

export default User;
