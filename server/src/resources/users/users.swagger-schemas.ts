export const UsersSwaggerSchemas = {
  findUsers: {
    query: { type: 'string' },
    pagination: {
      page: { type: 'integer' },
      limit: { type: 'integer' },
      sort: {
        type: 'object',
        properties: {
          by: { type: 'string' },
          order: { type: 'integer' }
        }
      }
    }
  },
  createUser: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string', default: null },
      fullname: { type: 'string' },
      role: { type: 'string' }
    }
  },
  changeUserRole: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      role: { type: 'string' }
    }
  },
  updateUserProfile: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        default: null
      },
      email: {
        type: 'string',
        default: null
      },
      fullname: {
        type: 'string',
        default: null
      },
      role: {
        type: 'string',
        default: null
      }
    }
  },
  changeAvatar: {
    type: 'object',
    properties: {
      filename: { type: 'string' },
      data: { type: 'string' }
    }
  }
};
