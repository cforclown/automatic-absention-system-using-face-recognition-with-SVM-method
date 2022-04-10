export const RolesSwaggerSchemas = {
  findRoles: {
    query: { type: 'string' },
    pagination: {
      page: 'integer',
      limit: 'integer',
      sort: {
        by: { type: 'string' },
        order: { type: 'integer' }
      }
    }
  },
  createRole: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      permissions: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              view: { type: 'boolean', default: true },
              create: { type: 'boolean', default: false },
              update: { type: 'boolean', default: false },
              delete: { type: 'boolean', default: false }
            }
          },
          masterData: {
            type: 'object',
            properties: {
              view: { type: 'boolean', default: true },
              create: { type: 'boolean', default: false },
              update: { type: 'boolean', default: false },
              delete: { type: 'boolean', default: false }
            }
          }
        }
      }
    }
  },
  updateRole: {
    type: 'object',
    properties: {
      _id: { type: 'string', required: true },
      name: { type: 'string' },
      permissions: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              view: { type: 'boolean', default: true },
              create: { type: 'boolean', default: false },
              update: { type: 'boolean', default: false },
              delete: { type: 'boolean', default: false }
            }
          },
          masterData: {
            type: 'object',
            properties: {
              view: { type: 'boolean', default: true },
              create: { type: 'boolean', default: false },
              update: { type: 'boolean', default: false },
              delete: { type: 'boolean', default: false }
            }
          }
        }
      }
    }
  }
};
