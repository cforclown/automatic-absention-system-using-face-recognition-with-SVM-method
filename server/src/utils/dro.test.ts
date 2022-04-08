import { dro } from './dro';

describe('data-response-object', () => {
  const data = { message: 'message' };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('data-response-object should contain data', () => {
    const response = dro.response(data);
    expect(response).toHaveProperty('data');
    expect(response.data).toEqual(data);
    expect(response).toHaveProperty('error');
    expect(response.error).toEqual(null);
  });

  it('data-response-object should contain error message', () => {
    const response = dro.error('error message');
    expect(response).toHaveProperty('data');
    expect(response.data).toEqual(null);
    expect(response).toHaveProperty('error');
    expect(response.error).toEqual('error message');
  });
});
