import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'oracle',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_HOST})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SERVICE_NAME=${process.env.DB_NAME})))`,
  synchronize: false,
});
