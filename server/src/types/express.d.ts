import { ParsedQs } from "qs";
import { type ApiResponse } from "@shared/types";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: ParsedQs;
      validatedParams?: any;
    }

    interface Response {
      success: <T>(input: {
        status?: number;
        data: T;
        message?: string;
      }) => void;
      fail: (input: { status: number; errors?: any; message?: string }) => void;
    }
  }
}
