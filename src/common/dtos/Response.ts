export interface ResponseSucess<T> {
  status: 1;
  data?: T;
}

export interface ResponseFalse<T> {
  status: 0;
  data?: T;
}
