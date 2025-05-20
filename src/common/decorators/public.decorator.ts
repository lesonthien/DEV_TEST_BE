import { applyDecorators, SetMetadata } from '@nestjs/common';

const PublicAuthMiddleware = SetMetadata('isPublic', true);
const PublicAuthSwagger = SetMetadata('swagger/apiSecurity', ['public']);
export const Public = () => applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);
