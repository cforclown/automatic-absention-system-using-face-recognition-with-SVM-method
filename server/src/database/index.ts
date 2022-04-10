import mongoose from 'mongoose';
import { Environment } from '../common';
import { RolesModel, StudentsModel, UsersModel } from '../resources';

class Database {
  constructor () {
    this.connect = this.connect.bind(this);
  }

  async connect (): Promise<void> {
    await mongoose.connect(Environment.getDBUri(), { dbName: Environment.getDBName() });

    this.registerModels();
  }

  close (): void {
    mongoose.disconnect();
  }

  registerModels (): void {
    mongoose.model('users', UsersModel);
    mongoose.model('roles', RolesModel);
    mongoose.model('students', StudentsModel);
  }
}

export default Database;
