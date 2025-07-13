import {
  getAttendanceService,
  upsertAttendanceService,
} from "@/services/internal/attendance.service";
import {
  type AttendanceQuery,
  type AttendanceList,
} from "@shared/types/domain.types";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function getAttendance(req, res) {
  const query: AttendanceQuery = req.validatedQuery;
  const serviceResponse: ServiceResponse<AttendanceList> =
    await getAttendanceService(query);

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

export async function upsertAttendance(req, res) {
  const serviceResponse: ServiceResponse<undefined> =
    await upsertAttendanceService(req.validatedBody);
  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }
  return res.status(serviceResponse.status).end();
}
