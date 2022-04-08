import { Schema } from 'mongoose';

export const RolesModel = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: false, default: '' },
  permissions: {
    users: {
      type: {
        view: { type: Boolean, required: false, default: true },
        create: { type: Boolean, required: false, default: false },
        update: { type: Boolean, required: false, default: false },
        delete: { type: Boolean, required: false, default: false }
      },
      required: false,
      default: {
        view: true,
        create: false,
        update: false,
        delete: false
      }
    },
    masterData: {
      type: {
        view: { type: Boolean, required: false, default: false },
        create: { type: Boolean, required: false, default: false },
        update: { type: Boolean, required: false, default: false },
        delete: { type: Boolean, required: false, default: false }
      },
      required: false,
      default: {
        view: false,
        create: false,
        update: false,
        delete: false
      }
    }
  },
  archived: { type: Boolean, required: false, default: false },
  default: { type: Boolean, required: false, default: false }
});
