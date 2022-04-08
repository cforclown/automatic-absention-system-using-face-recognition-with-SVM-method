export function getEnvOrThrow(varName) {
  const envVar = process.env[varName];
  if (!envVar) {
    throw new Error(`Environment variable ${varName} not set`);
  }
  return envVar;
}

export const Environment = {
  getApiUrl: () => getEnvOrThrow('API_URL'),
  // getApiUrl: () => 'localhost:5000/',
};
