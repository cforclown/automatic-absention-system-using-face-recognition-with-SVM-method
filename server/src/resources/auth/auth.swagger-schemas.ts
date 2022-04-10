export const AuthSwaggerSchemas = {
  login: {
    type: 'object',
    properties: {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  },
  refreshToken: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string' }
    }
  }
};
