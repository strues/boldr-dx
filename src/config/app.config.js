export const env = (string) => {
  return process.env[string] || '';
};

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  env: NODE_ENV,
  host: 'localhost',
  port: 3000
};

export default config;
