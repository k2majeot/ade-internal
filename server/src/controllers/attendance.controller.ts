import {
  getAttendanceService,
  upsertAttendanceService,
} from "@/services/attendance.service";
import { type AttendaneQuery, type AttendanceList } from "@shared/validation";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";
import { Side } from "@shared/types";

export async function getAttendance(req, res) {
  const query: AttendaneQuery = req.validatedQuery;
  const userSide = req.user.side;
  const requestedSide = query.side;

  if (userSide !== Side.All && userSide !== requestedSide) {
    return res.fail({
      status: 403,
      message: "Access denied: you do not have permission to access this side.",
    });
  }

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
