export const LookupRegistry = {
  Role: {
    table: "roles",
    codeToEnum: CodeToRole,
    idToEnum: IdToRole,
    details: RoleDetails,
  },
  Status: {
    table: "statuses",
    codeToEnum: CodeToStatus,
    idToEnum: IdToStatus,
    details: StatusDetails,
  },
  Side: {
    table: "sides",
    codeToEnum: CodeToSide,
    idToEnum: IdToSide,
    details: SideDetails,
  },
  AttendanceStatus: {
    table: "attendance_statuses",
    codeToEnum: CodeToAttendanceStatus,
    idToEnum: IdToAttendanceStatus,
    details: AttendanceStatusDetails,
  },
  PromptLevel: {
    table: "prompt_levels",
    codeToEnum: CodeToPromptLevel,
    idToEnum: IdToPromptLevel,
    details: PromptLevelDetails,
  },
} as const;
