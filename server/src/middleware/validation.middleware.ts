import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type SourceValidation = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export default function validationHandler(sources: SourceValidation) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const source of Object.keys(sources) as (keyof SourceValidation)[]) {
      const schema = sources[source];
      if (!schema) continue;

      const result = schema.safeParse(req[source]);
      if (!result.success) {
        return res.fail({
          status: 400,
          message: `${source} validation failed`,
          errors: result.error.format(),
        });
      }

      if (source === "body") req.validatedBody = result.data;
      if (source === "query") req.validatedQuery = result.data;
      if (source === "params") req.validatedParams = result.data;
    }

    next();
  };
}
