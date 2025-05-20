import { JwtPayload } from 'src/auth';

export interface RequestContext {
  user: JwtPayload;
}
