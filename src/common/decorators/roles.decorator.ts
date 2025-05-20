import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ActionEnum, ScreenName } from '../permission';

export const Roles = (module: ScreenName, actions: ActionEnum[]): CustomDecorator => {
  return SetMetadata('permission', [module, actions]);
};
