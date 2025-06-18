import { apiResponseSchema, type ApiResponse } from "@shared/validation";
import type { ZodType } from "zod";
import type { ServiceResult } from "@/types/apiTypes";

export async function fetchWithResponse<T, P>(
  service: (params: P) => Promise<Response>,
  serviceParams: P,
  paramSchema: ZodType<P>,
  dataSchema: ZodType<T>
): Promise<ServiceResult<T>> {
  try {
    const paramsVal = paramSchema.safeParse(serviceParams);
    if (!paramsVal.success) {
      return { success: false, message: "Invalid service parameters" };
    }

    const response = await service(paramsVal.data);
    const json: unknown = await response.json();

    const responseVal = apiResponseSchema.safeParse(json);
    if (!responseVal.success) {
      return { success: false, message: "Malformed API response" };
    }

    const apiResponse = responseVal.data as ApiResponse<unknown>;

    if (!apiResponse.success) {
      return {
        success: false,
        message: apiResponse.message ?? "Unknown error",
      };
    }

    const dataVal = dataSchema.safeParse(apiResponse.data);
    if (!dataVal.success) {
      return { success: false, message: "Invalid response data" };
    }

    return { success: true, data: dataVal.data };
  } catch (error) {
    console.error("Request failed:", error);
    return { success: false, message: "Network error" };
  }
}

export async function fetchNoResponse<P>(
  service: (params: P) => Promise<Response>,
  serviceParams: P,
  paramSchema: ZodType<P>
): Promise<ServiceResult<undefined>> {
  try {
    const paramsVal = paramSchema.safeParse(serviceParams);
    if (!paramsVal.success) {
      return { success: false, message: "Invalid service parameters" };
    }

    const response = await service(paramsVal.data);

    if (!response.ok) {
      const json: unknown = await response.json();

      const responseVal = apiResponseSchema.safeParse(json);
      if (!responseVal.success) {
        return { success: false, message: "Malformed API response" };
      }

      const apiResponse = responseVal.data as ApiResponse<unknown>;
      if (!apiResponse.success) {
        return {
          success: false,
          message: apiResponse.message ?? "Unknown error",
        };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Request failed:", error);
    return { success: false, message: "Network error" };
  }
}
