import { model } from 'mongoose';
import { Logger } from '../common';
import Database from '../database';
import { admin, adminRole } from './initial-data';

/**
 * this scripts will do nothing when there already role in roles collection
 */
async function insertInitialData (): Promise<void> {
  try {
    const database = new Database();
    await database.connect();

    const roleModel = model('roles');
    const userModel = model('users');
    if ((await roleModel.find({}).exec()).length === 0) {
      const roleDoc = await roleModel.create(adminRole);
      const userDoc = await userModel.create(admin);
      await Promise.all([roleDoc.save(), userDoc.save()]);
    }
    Logger.success('Done !');
  } catch (err) {
    Logger.error('Insert initial data failed!');
    if (err instanceof Error) {
      Logger.error(err.message);
    }
  }
}

insertInitialData().then(() => process.exit());
