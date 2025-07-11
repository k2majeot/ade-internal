// AUTO-GENERATED FILE. DO NOT EDIT.


export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export const CodeToRole: Record<string, Role> = {
  "admin": Role.ADMIN,
  "user": Role.USER,
};

export const IdToRole: Record<number, Role> = {
  1: Role.ADMIN,
  2: Role.USER,
};

export const RoleDetails: Record<Role, { id: number; code: string; label: string; level: number }> = {
  [Role.ADMIN]: { id: 1, code: "admin", label: "Admin", level: 100 },
  [Role.USER]: { id: 2, code: "user", label: "User", level: 1 },
};

export enum Side {
  BOTH = "both",
  ONE = "one",
  TWO = "two",
}

export const CodeToSide: Record<string, Side> = {
  "both": Side.BOTH,
  "one": Side.ONE,
  "two": Side.TWO,
};

export const IdToSide: Record<number, Side> = {
  3: Side.BOTH,
  1: Side.ONE,
  2: Side.TWO,
};

export const SideDetails: Record<Side, { id: number; code: string; label: string }> = {
  [Side.BOTH]: { id: 3, code: "both", label: "Both Sides" },
  [Side.ONE]: { id: 1, code: "one", label: "ADE" },
  [Side.TWO]: { id: 2, code: "two", label: "ADE TOO!" },
};

export enum Status {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
}

export const CodeToStatus: Record<string, Status> = {
  "active": Status.ACTIVE,
  "deactivated": Status.DEACTIVATED,
};

export const IdToStatus: Record<number, Status> = {
  1: Status.ACTIVE,
  2: Status.DEACTIVATED,
};

export const StatusDetails: Record<Status, { id: number; code: string; label: string }> = {
  [Status.ACTIVE]: { id: 1, code: "active", label: "Active" },
  [Status.DEACTIVATED]: { id: 2, code: "deactivated", label: "Deactivated" },
};

export enum AttendanceStatus {
  ABSENT = "absent",
  NOT_SCHEDULED = "not_scheduled",
  PRESENT = "present",
}

export const CodeToAttendanceStatus: Record<string, AttendanceStatus> = {
  "absent": AttendanceStatus.ABSENT,
  "not_scheduled": AttendanceStatus.NOT_SCHEDULED,
  "present": AttendanceStatus.PRESENT,
};

export const IdToAttendanceStatus: Record<number, AttendanceStatus> = {
  2: AttendanceStatus.ABSENT,
  3: AttendanceStatus.NOT_SCHEDULED,
  1: AttendanceStatus.PRESENT,
};

export const AttendanceStatusDetails: Record<AttendanceStatus, { id: number; code: string; label: string }> = {
  [AttendanceStatus.ABSENT]: { id: 2, code: "absent", label: "Absent" },
  [AttendanceStatus.NOT_SCHEDULED]: { id: 3, code: "not_scheduled", label: "Not Scheduled" },
  [AttendanceStatus.PRESENT]: { id: 1, code: "present", label: "Present" },
};

export enum PromptLevel {
  GESTURAL_PROMPT = "gestural_prompt",
  HAND_OVER_HAND = "hand_over_hand",
  INDEPENDENT = "independent",
  NO_RESPONSE = "no_response",
  PHYSICAL_PROMPT = "physical_prompt",
  REFUSED = "refused",
  VERBAL_PROMPT = "verbal_prompt",
}

export const CodeToPromptLevel: Record<string, PromptLevel> = {
  "gestural_prompt": PromptLevel.GESTURAL_PROMPT,
  "hand_over_hand": PromptLevel.HAND_OVER_HAND,
  "independent": PromptLevel.INDEPENDENT,
  "no_response": PromptLevel.NO_RESPONSE,
  "physical_prompt": PromptLevel.PHYSICAL_PROMPT,
  "refused": PromptLevel.REFUSED,
  "verbal_prompt": PromptLevel.VERBAL_PROMPT,
};

export const IdToPromptLevel: Record<number, PromptLevel> = {
  2: PromptLevel.GESTURAL_PROMPT,
  5: PromptLevel.HAND_OVER_HAND,
  1: PromptLevel.INDEPENDENT,
  6: PromptLevel.NO_RESPONSE,
  4: PromptLevel.PHYSICAL_PROMPT,
  7: PromptLevel.REFUSED,
  3: PromptLevel.VERBAL_PROMPT,
};

export const PromptLevelDetails: Record<PromptLevel, { id: number; code: string; label: string }> = {
  [PromptLevel.GESTURAL_PROMPT]: { id: 2, code: "gestural_prompt", label: "Gestural Prompt" },
  [PromptLevel.HAND_OVER_HAND]: { id: 5, code: "hand_over_hand", label: "Hand-Over-Hand" },
  [PromptLevel.INDEPENDENT]: { id: 1, code: "independent", label: "Independent" },
  [PromptLevel.NO_RESPONSE]: { id: 6, code: "no_response", label: "No Response" },
  [PromptLevel.PHYSICAL_PROMPT]: { id: 4, code: "physical_prompt", label: "Physical Prompt" },
  [PromptLevel.REFUSED]: { id: 7, code: "refused", label: "Refused" },
  [PromptLevel.VERBAL_PROMPT]: { id: 3, code: "verbal_prompt", label: "Verbal Prompt" },
};

export const LookupRegistry = {
  roles: { table: "roles", codeToEnum: CodeToRole, idToEnum: IdToRole, details: RoleDetails },
  sides: { table: "sides", codeToEnum: CodeToSide, idToEnum: IdToSide, details: SideDetails },
  statuses: { table: "statuses", codeToEnum: CodeToStatus, idToEnum: IdToStatus, details: StatusDetails },
  attendance_statuses: { table: "attendance_statuses", codeToEnum: CodeToAttendanceStatus, idToEnum: IdToAttendanceStatus, details: AttendanceStatusDetails },
  prompt_levels: { table: "prompt_levels", codeToEnum: CodeToPromptLevel, idToEnum: IdToPromptLevel, details: PromptLevelDetails },
} as const;
