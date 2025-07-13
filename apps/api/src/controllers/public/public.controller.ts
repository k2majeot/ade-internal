import { submitContactService } from "@/services/public/public.service";
import type { Contact } from "@shared/validation";
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
