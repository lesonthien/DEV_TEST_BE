export enum BooleanEnum {
  TRUE = '1',
  FALSE = '0',
}

export const BooleanValue = (value?: boolean) => {
  if (value) {
    return BooleanEnum.TRUE;
  }

  return BooleanEnum.FALSE;
};

export const ValueToBoolean = (value?: BooleanEnum) => {
  return value === BooleanEnum.TRUE;
};
