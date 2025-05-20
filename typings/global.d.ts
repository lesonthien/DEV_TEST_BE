import type { Payload } from '../src/auth';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      DB_TYPE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_LOGGING: string;

      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;

      API_KET_SET_SIM: string;
      DOMAIN_GET_SIM: string;

      VNP_TMN_CODE: string;
      VNP_HASH_SECRET: string;
      VNP_RETURN_URL: string;
      VNP_URL: string;
    }
  }

  namespace Express {
    interface Request {
      // customProps of pino-http
      customProps: object;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Payload {}
  }
}
