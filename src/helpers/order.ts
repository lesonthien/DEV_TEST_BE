import { FindOptionsOrderValue } from 'typeorm';

export const getOrder = (input?: { keySort?: string; typeSort?: FindOptionsOrderValue }): Record<string, FindOptionsOrderValue> => {
  const order: Record<string, FindOptionsOrderValue> = {};

  if (!input?.keySort || !input.typeSort) {
    return order;
  }

  order[input.keySort] = input.typeSort;

  return order;
};
