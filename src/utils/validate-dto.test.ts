import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { validateBody, validateParams, validateQuery } from './validate-dto';
import { HttpCodes } from '../exceptions';
import { UserIdSchema } from '../resources/users/users.dto';
import { LoginPayloadSchema } from '../resources/auth/auth.dto';

describe('validate-dto', () => {
  const res = mockResponse({});
  const mockNext = { next: (): boolean => true };
  const spyNext = jest.spyOn(mockNext, 'next');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate-body', () => {
    it('should successfully validate body', () => {
      const req = mockRequest({
        body: {
          username: 'username',
          password: 'password'
        }
      });

      const event = validateBody(LoginPayloadSchema);
      expect(typeof event).toBe('function');
      event(req, res, mockNext.next);
      expect(spyNext).toHaveBeenCalled();
    });

    it('should send error response with bad request code', () => {
      const req = mockRequest({
        body: {
          username: null,
          password: 'password'
        }
      });

      const event = validateBody(LoginPayloadSchema);
      expect(typeof event).toBe('function');
      event(req, res, mockNext.next);
      expect(spyNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.status.mock.calls[0][0]).toEqual(HttpCodes.BadRequest);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('validate-params', () => {
    it('should successfully validate params', () => {
      const req = mockRequest({
        params: {
          userId: 'userId'
        }
      });

      const event = validateParams(UserIdSchema);
      expect(typeof event).toBe('function');
      event(req, res, mockNext.next);
      expect(spyNext).toHaveBeenCalled();
    });

    it('should send error response with bad request code when validating request params', () => {
      const req = mockRequest({ params: {} });

      const event = validateParams(UserIdSchema);
      expect(typeof event).toBe('function');
      event(req, res, mockNext.next);
      expect(spyNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.status.mock.calls[0][0]).toEqual(HttpCodes.BadRequest);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('validate-query', () => {
    it('should successfully validate query', () => {
      const req = mockRequest({
        query: {
          userId: 'userId'
        }
      });

      const event = validateQuery(UserIdSchema);
      expect(typeof event).toBe('function');
      event(req, res, mockNext.next);
      expect(spyNext).toHaveBeenCalled();
    });

    it('should send error response with bad request code when validating request queries', () => {
      const req = mockRequest({ query: {} });

      const event = validateQuery(UserIdSchema);
      expect(typeof event).toBe('function');
      event(req, res, mockNext.next);
      expect(spyNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.status.mock.calls[0][0]).toEqual(HttpCodes.BadRequest);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
