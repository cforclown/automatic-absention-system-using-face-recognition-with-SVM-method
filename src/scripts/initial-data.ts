import { Types } from 'mongoose';
import { Role, User } from '../resources';

export const adminRole: Role = {
  _id: (new Types.ObjectId()).toString(),
  name: 'Admin',
  permissions: {
    users: { view: true, create: true, update: true, delete: true },
    masterData: { view: true, create: true, update: true, delete: true }
  },
  desc: 'Admin role. Allowed to view, create, modify and delete data. Default. This role cannot be deleted',
  default: true,
  editable: false
};

export const admin: User = {
  _id: (new Types.ObjectId()).toString(),
  username: 'admin',
  password: '99adc231b045331e514a516b4b7680f588e3823213abe901738bc3ad67b2f6fcb3c64efb93d18002588d3ccc1a49efbae1ce20cb43df36b38651f11fa75678e8', // root
  fullname: 'Admin',
  role: adminRole._id
};
