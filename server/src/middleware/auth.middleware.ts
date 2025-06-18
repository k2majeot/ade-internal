import { Role, RoleLevel } from "@shared/types";
import { Request, Response, NextFunction } from "express";

export function requireAtLeast(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentRole = req.session?.role as Role;

    if (!currentRole) {
      return res.fail({ status: 401, message: "Unauthorized" });
    }

    const currentLevel = RoleLevel[currentRole];
    const requiredLevel = RoleLevel[minRole];

    if (currentLevel < requiredLevel) {
      return res.fail({ status: 403, message: "Forbidden" });
    }

    next();
  };
}
