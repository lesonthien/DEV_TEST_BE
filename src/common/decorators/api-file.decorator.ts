import { ApiBody } from '@nestjs/swagger';

export const ApiFile =
  (fileName = 'file'): MethodDecorator =>
  (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
