import {model, Schema} from 'mongoose';

const UserSchema = new Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false},
});

const User = model('User', UserSchema);

export default User;
