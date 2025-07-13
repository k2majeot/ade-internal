import { Request, Response, NextFunction } from "express";

import { Role, RoleLevel } from "@shared/types";
import { hasRequiredRole } from "@shared/utils";
import { getUserService } from "@/services/internal/user.service";

export async function requireAuth(req, res, next) {
  if (!req.session?.uid) {
    return res.fail({ status: 401, message: "Unauthorized" });
  }

  const result = await getUserService(req.session.uid);
  if (!result.success) {
    return res.fail({ status: 403, message: "User not found" });
  }

  req.user = result.data;
  next();
}

export function requireAtLeast(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      return res.fail({ status: 401, message: "Unauthorized" });
    }

    if (!hasRequiredRole(role, minRole)) {
      return res.fail({ status: 403, message: "Forbidden" });
    }

    next();
  };
}
