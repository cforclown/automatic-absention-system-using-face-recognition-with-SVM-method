import { HttpCodes } from '.';
import { RestApiException } from './rest-api-exception';

describe('request-error', () => {
  const errorMessage = 'error message';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should contain default httpCode (400/bad request)', () => {
    const error = new RestApiException(errorMessage);
    expect(error).toHaveProperty('httpCode');
    expect(error.httpCode).toEqual(HttpCodes.BadRequest);
    expect(error.message).toEqual(errorMessage);
  });

  it('should contain defined httpCode', () => {
    const error = new RestApiException(errorMessage, HttpCodes.Internal);
    expect(error).toHaveProperty('httpCode');
    expect(error.httpCode).toEqual(HttpCodes.Internal);
    expect(error.message).toEqual(errorMessage);
  });
});
