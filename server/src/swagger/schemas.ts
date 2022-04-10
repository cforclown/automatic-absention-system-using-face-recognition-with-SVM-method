import { AuthSwaggerSchemas, RolesSwaggerSchemas, StudentSwaggerSchemas, UsersSwaggerSchemas } from '../resources';

const schemas = Object.assign(
  {},
  { ...AuthSwaggerSchemas },
  { ...UsersSwaggerSchemas },
  { ...RolesSwaggerSchemas },
  { ...StudentSwaggerSchemas }
);

export default schemas;
