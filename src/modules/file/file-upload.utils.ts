import { extname } from 'path';

export const imageFileFilter = (_req: unknown, file: { originalname: string }, callback: (arg0: Error | null, arg1: boolean) => void) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(new Error('Only image files are allowed!'), false);
    return;
  }
  callback(null, true);
};

export const editFileName = (_req: unknown, file: { originalname: string }, callback: (arg0: null, arg1: string) => void) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
