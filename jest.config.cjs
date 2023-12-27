module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@hapi/(.*)$": "@hapi/$1",
  }
};
