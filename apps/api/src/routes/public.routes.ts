import express from "express";
import asyncHandler from "express-async-handler";

import validationHandler from "@/middleware/validation.middleware";
import { submitContact } from "@/controllers/public/contact.controller";
import { contactSchema } from "@shared/validation";

const router = express.Router();

router.post(
  "/contact",
  validationHandler({ body: contactSchema }),
  asyncHandler(submitContact)
);

const publicRouter = router;
export default publicRouter;
