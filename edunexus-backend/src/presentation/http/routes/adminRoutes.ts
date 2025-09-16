import { Router } from "express";
import { userRepository } from "../../../infrastructure/repositories/UserRepository";
import { GetAllStudentsUseCase } from "../../../app/useCase/admin/GetAllStudentsUseCase";
import { adaptRoutewithFiltert } from "../../adapters/RouterAdapter";
import { GetAllTeachersUseCase } from "../../../app/useCase/admin/GetAllTeachersUseCase";
import authMiddleware from "../../../infrastructure/middleware/authMiddleware";
import { adaptUpdateUserBlockStatus } from "../../adapters/Teacher/adaptUpdateUserBlockStatus";
import { UpdateUserBlockStatusUseCase } from "../../../app/useCase/admin/UpdateUserBlockStatusUseCase";
import { GetTeacherProfileUseCase } from "../../../app/useCase/teacher/GetTeacherUserCase";
import { adaptGetTeacherProfile } from "../../adapters/Admin/adaptGetTeacherProfile";
import { adaptUpdateTeacherApproval } from "../../adapters/Admin/TeacherApprovalAdapter";
import { UpdateTeacherApprovalUseCase } from "../../../app/useCase/admin/UpdateTeacherApprovalUseCase";
import { adaptRoutewithFilter } from "../../adapters/adaptRoutewithFilter";

const route = Router();
const useRepo = new userRepository();
const getAllStudentsUseCase = new GetAllStudentsUseCase(useRepo);
const getallteachersUseCase = new  GetAllTeachersUseCase(useRepo);
const updateUserBlockStatusUseCase = new UpdateUserBlockStatusUseCase(useRepo);
const getTeacherProfileuseCse = new GetTeacherProfileUseCase(useRepo)
const updateTeacherApprovalUseCase = new UpdateTeacherApprovalUseCase(useRepo);

route.get('/get-all-students', authMiddleware, adaptRoutewithFilter(getAllStudentsUseCase));
route.get('/get-all-teachers', authMiddleware, adaptRoutewithFiltert(getallteachersUseCase));
route.put('/block/:userId',authMiddleware, adaptUpdateUserBlockStatus(updateUserBlockStatusUseCase));
route.get('/teachers/profile/:id', authMiddleware,adaptGetTeacherProfile(getTeacherProfileuseCse));
route.post("/teachers-approval/:id",authMiddleware,adaptUpdateTeacherApproval(updateTeacherApprovalUseCase));

export default route;