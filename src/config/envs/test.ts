export const config = {
  db: {
    type: process.env.DB_TYPE,
    synchronize: false,
    logging: process.env.DB_LOGGING,
    host: process.env.DB_HOST,
    port: 1521,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
  },
  foo: 'dev-bar',
};
