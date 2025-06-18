import { getUsersService } from "@/services/user.service";
import { type UsersList } from "@shared/types";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function getAttendance(req, res) {
  const serviceResponse: ServiceResponse<UsersList> = await getUsersService();
  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }
  return res.success({
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}
