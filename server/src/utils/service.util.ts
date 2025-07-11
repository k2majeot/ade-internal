import { type ServiceSuccess, type ServiceFail } from "@/types/server.types";
import { RoleDetails } from "@shared/generated/lookup.types";

export function createSuccess<T>({
  status = 200,
  data,
  message = "OK",
}: {
  status?: number;
  data?: T;
  message?: string;
}): ServiceSuccess<T> {
  return {
    success: true,
    status,
    data,
    message,
  };
}

export function createFail({
  status,
  errors = undefined,
  message = "Error",
}: {
  status: number;
  errors?: any;
  message?: string;
}): ServiceFail {
  return {
    success: false,
    status,
    errors,
    message,
  };
}

const EnumMaps = {
  role: {
    codeToEnum: CodeToRole,
    idToEnum: IdToRole,
    details: RoleDetails,
  },
  status: {
    codeToEnum: CodeToStatus,
    idToEnum: IdToStatus,
    details: StatusDetails,
  },
  attendance_status: {
    codeToEnum: CodeToAttendanceStatus,
    idToEnum: IdToAttendanceStatus,
    details: AttendanceStatusDetails,
  },
  side: {
    codeToEnum: CodeToSide,
    idToEnum: IdToSide,
    details: SideDetails,
  },
  prompt_level: {
    codeToEnum: CodeToPromptLevel,
    idToEnum: IdToPromptLevel,
    details: PromptLevelDetails,
  },
} as const;

async function getIdByCode(
  table: keyof typeof EnumMaps,
  code: string
): Promise<number> {
  const { codeToEnum, details } = EnumMaps[table];
  const enumVal = codeToEnum[code];
  if (!enumVal) throw new Error(`Invalid ${table} code: ${code}`);
  return details[enumVal].id;
}

async function getCodeById(
  table: keyof typeof EnumMaps,
  id: number
): Promise<string> {
  const { idToEnum, details } = EnumMaps[table];
  const enumVal = idToEnum[id];
  if (!enumVal) throw new Error(`Invalid ${table} ID: ${id}`);
  return details[enumVal].code;
}
