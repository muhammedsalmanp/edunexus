import { Request, Response, NextFunction } from "express";
import { UpdateTeacherApprovalUseCase } from "../../../app/useCase/admin/UpdateTeacherApprovalUseCase";

export const adaptUpdateTeacherApproval = (useCase: UpdateTeacherApprovalUseCase) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.params.id;
      const { action, rejectionMessage } = req.body as { action: "approved" | "rejected"; rejectionMessage?: string };
      const currentUserRole = req.user?.role;
      console.log(teacherId, action, rejectionMessage, currentUserRole);

      if (!teacherId) {
        return res.status(400).json({ error: "Teacher ID is required" });
      }

      if (!action || !["approved", "rejected"].includes(action)) {
        return res.status(400).json({ error: "Action must be 'approved' or 'rejected'" });
      }

      // Require rejectionMessage when action is "rejected"
      if (action === "rejected" && !rejectionMessage) {
        return res.status(400).json({ error: "Rejection message is required when rejecting a teacher" });
      }

          console.log(teacherId, action, currentUserRole, rejectionMessage);
          
      const updatedTeacher = await useCase.execute(teacherId, action, currentUserRole, rejectionMessage);
      if (!updatedTeacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      res.json({
        message: `Teacher ${action}d successfully`,
        teacher: updatedTeacher,
      });
    } catch (error) {
      next(error);
    }
  };
};