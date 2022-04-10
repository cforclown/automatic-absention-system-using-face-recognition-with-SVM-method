import { Schema } from 'mongoose';

export const StudentsModel = new Schema({
  fullname: { type: String, required: true },
  nim: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  archived: { type: Boolean, required: false, default: false }
});
