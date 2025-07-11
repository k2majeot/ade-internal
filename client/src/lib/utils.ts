import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import type { ApiResult } from "@/types/apiTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toastApiResult<T>(
  res: ApiResult<T>,
  successMsg: string,
  errorMsg: string
): boolean {
  if (res.success) {
    toast.success(successMsg);
    return true;
  }
  toast.error(res.message || errorMsg);
  return false;
}

export async function withToast<T>(
  fn: () => Promise<ApiResult<T>>,
  successMsg: string,
  errorMsg: string
): Promise<boolean> {
  const res = await fn();
  return toastApiResult(res, successMsg, errorMsg);
}

export function emptyDefaults<T extends z.ZodObject<any>>(
  schema: T
): z.infer<T> {
  return Object.fromEntries(
    Object.keys(schema.shape).map((k) => [k, ""])
  ) as z.infer<T>;
}
