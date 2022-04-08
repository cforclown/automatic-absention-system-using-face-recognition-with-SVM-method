import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { HttpCodes } from '../exceptions';
import { checkAuthorization } from './check-authorization';

describe('check-authorization', () => {
  const user = {
    role: {
      permissions: {
        users: {
          view: true,
          create: true,
          update: true,
          delete: true
        }
      }
    }
  };
  const req = mockRequest({ user });
  const res = mockResponse({});
  const mockNext = { next: (): boolean => true };
  const spyNext = jest.spyOn(mockNext, 'next');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully allow authorized user', () => {
    const result = checkAuthorization('users', 'create');
    expect(typeof result).toBe('function');
    result(req, res, mockNext.next);
    expect(spyNext).toHaveBeenCalled();
  });

  it('should not allow unauthorized user to do action on resource', () => {
    const result = checkAuthorization('roles', 'create');
    expect(typeof result).toBe('function');
    result(req, res, mockNext.next);
    expect(spyNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status.mock.calls[0][0]).toEqual(HttpCodes.Forbidden);
    expect(res.send).toHaveBeenCalled();
  });

  it('should send unauthorized status when user is not found', () => {
    const result = checkAuthorization('users', 'create');
    expect(typeof result).toBe('function');
    result(mockRequest(), res, mockNext.next);
    expect(spyNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status.mock.calls[0][0]).toEqual(HttpCodes.Unauthorized);
    expect(res.send).toHaveBeenCalled();
  });
});
