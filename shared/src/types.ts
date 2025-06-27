export enum Role {
  User = "User",
  Admin = "Admin",
}

export const RoleLevel: Record<Role, number> = {
  [Role.User]: 1,
  [Role.Admin]: 2,
};

export enum Present {
  Here = "Here",
  Absent = "Absent",
  NotScheduled = "Not Scheduled",
}

export enum Status {
  Active = "Active",
  Deactivated = "Deactivated",
}
