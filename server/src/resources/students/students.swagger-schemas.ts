export const StudentSwaggerSchemas = {
  findStudents: {
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
  createStudent: {
    fullname: { type: 'string', required: true },
    nim: { type: 'string', required: true },
    dateOfBirth: { type: 'string', required: true }
  },
  updateStudent: {
    _id: { type: 'string', required: true },
    fullname: { type: 'string' },
    nim: { type: 'string' },
    dateOfBirth: { type: 'string' }
  }
};
