import { FindRolesPayload, FindRolesResult } from '.';
import { Role, RolesDao } from '..';

export class RolesService {
  rolesDao: RolesDao;

  constructor ({ rolesDao }: { rolesDao: RolesDao; }) {
    this.rolesDao = rolesDao;
  }

  get (roleId: string): Promise<Role | null> {
    return this.rolesDao.get(roleId);
  }

  find (payload: FindRolesPayload): Promise<FindRolesResult> {
    return this.rolesDao.find(payload);
  }

  create (payload: Omit<Role, '_id'>): Promise<Role> {
    return this.rolesDao.create(payload);
  }

  update (payload: Role): Promise<Role> {
    return this.rolesDao.update(payload);
  }

  delete (roleId: string): Promise<Role> {
    return this.rolesDao.delete(roleId);
  }

  getDefault (): Promise<Role> {
    return this.rolesDao.getDefault();
  }

  setDefault (roleId: string): Promise<Role> {
    return this.rolesDao.setDefault(roleId);
  }
}
