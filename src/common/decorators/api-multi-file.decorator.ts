import { ApiBody } from '@nestjs/swagger';

export const ApiMultiFile =
  (fileName = 'files'): MethodDecorator =>
  (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
