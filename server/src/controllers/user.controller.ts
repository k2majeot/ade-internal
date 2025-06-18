import { getUsersService, updateUserService } from "@/services/user.service";
import { type UserList } from "@shared/validation";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function getUsers(req, res) {
  const serviceResponse: ServiceResponse<UserList> = await getUsersService();

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

export async function updateUser(req, res) {
  const { id }: SerialId = req.validatedParams;
  const userData: UserData = req.validatedBody;
  const serviceResponse: ServiceResponse<undefined> = await updateUserService(
    id,
    userData
  );

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }
  return res.status(serviceResponse.status).end();
}
