import { Lookups } from "@shared/types";
import { getLookupsService } from "@/services/lookup.service";

export async function getLookups(req, res) {
  const serviceResponse: ServiceResponse<Lookups> = await getLookupsService();

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.success({
    status: serviceResponse.status,
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}
