import { Schema } from 'mongoose';

export const UsersModel = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: false, default: null },
  role: { type: Schema.Types.ObjectId, required: true, ref: 'roles' },
  avatar: {
    type: {
      data: { type: String, required: true },
      filename: { type: String, required: true }
    },
    required: false,
    default: null
  },
  archived: { type: Boolean, required: false, default: false }
});
