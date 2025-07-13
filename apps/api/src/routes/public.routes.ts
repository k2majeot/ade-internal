import express from "express";
import asyncHandler from "express-async-handler";

import validationHandler from "@/middleware/validation.middleware";
import { submitContact } from "@/controllers/public/public.controller";
import { contactSchema } from "@shared/validation";

const router = express.Router();

router.post(
  "/contact",
  validationHandler({ body: contactSchema }),
  asyncHandler(submitContact)
);

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const publicRouter = router;
export default publicRouter;
