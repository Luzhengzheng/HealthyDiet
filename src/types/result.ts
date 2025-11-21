// 错误处理类型 - 待实现
export interface AppError {
  code: string;     // 错误代码
  message: string;  // 错误信息
  details?: any;    // 详细信息（可选）
}

export type Result<T> = {
  ok: true; value: T;
}|{
  ok: false;
  error: AppError;
}