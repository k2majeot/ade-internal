export type ResultSuccess<T> = {
  success: true;
  data?: T;
};

export type ResultFailure = {
  success: false;
  message: string;
};

export type Result<T> = ResultSuccess<T> | ResultFailure;

export type ApiResult<T> = Result<T>;
export type ServiceResult<T> = Result<T>;
