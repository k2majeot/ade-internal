import {
  submitContactService,
  submitApplicationService,
} from "@/services/public/public.service";
import type { Contact, Application } from "@shared/validation";
import type { MulterArray } from "@/validation/server.validation";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function submitContact(req, res) {
  const contact: Contact = req.validatedBody;
  const serviceResponse: ServiceResponse<undefined> =
    await submitContactService(contact);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }

  return res.status(serviceResponse.status).end();
}

export async function submitApplication(req, res) {
  const application: Application = req.validatedBody;
  const files: MulterArray = req.validatedFiles;
  const serviceResponse: ServiceResponse<undefined> =
    await submitApplicationService(application, files);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }

  return res.status(serviceResponse.status).end();
}
