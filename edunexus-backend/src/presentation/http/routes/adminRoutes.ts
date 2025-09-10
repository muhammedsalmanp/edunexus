import { Router } from "express";
import { userRepository } from "../../../infrastructure/repositories/UserRepository";
import { GetAllStudentsUseCase } from "../../../app/useCase/admin/GetAllStudentsUseCase";
import { adaptRoute } from "../../adapters/RouterAdapter";
import { GetAllTeachersUseCase } from "../../../app/useCase/admin/GetAllTeachersUseCase";
import authMiddleware from "../../../infrastructure/middleware/authMiddleware";
import { adaptUpdateUserBlockStatus } from "../../adapters/Teacher/adaptUpdateUserBlockStatus";
import { UpdateUserBlockStatusUseCase } from "../../../app/useCase/admin/UpdateUserBlockStatusUseCase";
import { GetTeacherProfileUseCase } from "../../../app/useCase/teacher/GetTeacherUserCase";
import { adaptGetTeacherProfile } from "../../adapters/Admin/adaptGetTeacherProfile";
import { adaptUpdateTeacherApproval } from "../../adapters/Admin/TeacherApprovalAdapter";
import { UpdateTeacherApprovalUseCase } from "../../../app/useCase/admin/UpdateTeacherApprovalUseCase";
const route = Router();
const useRepo = new userRepository();


route.get('/get-all-students', authMiddleware, adaptRoute(new GetAllStudentsUseCase(useRepo)));
route.get('/get-all-teachers', authMiddleware, adaptRoute(new GetAllTeachersUseCase(useRepo)));
route.put('/block/:userId',authMiddleware, adaptUpdateUserBlockStatus(new UpdateUserBlockStatusUseCase(useRepo)));
route.get('/teachers/profile/:id', authMiddleware,adaptGetTeacherProfile(new GetTeacherProfileUseCase(useRepo)));
route.post("/teachers-approval/:id",authMiddleware,adaptUpdateTeacherApproval(new UpdateTeacherApprovalUseCase(useRepo)));

export default route;