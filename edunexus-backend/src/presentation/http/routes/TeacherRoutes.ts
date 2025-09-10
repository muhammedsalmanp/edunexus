import express from 'express';
import { GetTeacherProfileUseCase } from '../../../app/useCase/teacher/GetTeacherUserCase';
import { UpdateTeacherProfileUseCase } from '../../../app/useCase/teacher/UpdateTeacherProfileUseCse';
import { userRepository} from '../../../infrastructure/repositories/UserRepository';
import { adaptGetTeacherProfile } from '../../adapters/Teacher/adaptGetTeacherProfile';
import { adaptUpdateTeacherProfile } from '../../adapters/Teacher/adaptUpdateTeacherProfile';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { adaptGetTeacherCourses } from '../../adapters/Teacher/GetTeacherCoursesRoute';
import { GetTeacherCoursesUseCase } from '../../../app/useCase/teacher/GetTeacherCoursesUseCase';
import { courseRepository } from '../../../infrastructure/repositories/CourseRepository';
import { uploadCourseMedia } from '../../../infrastructure/middleware/uploadMiddleware';
import { adaptAddCourse } from '../../adapters/Teacher/adaptAddCourse';
import { AddCourseUseCase } from '../../../app/useCase/teacher/AddCourseUseCase';
import { adaptApplyTeacher } from '../../adapters/Teacher/adaptApplyTeacher';
import { ApplyTeacherUseCase } from '../../../app/useCase/teacher/ApplyTeacherUseCase';
const router = express.Router();
const UserRepository = new userRepository();
const courseReopo = new courseRepository();
const getTeacherProfileUseCase = new GetTeacherProfileUseCase(UserRepository);
const updateTeacherProfileUseCase = new UpdateTeacherProfileUseCase(UserRepository);
const getTeacherCoursUseCase = new GetTeacherCoursesUseCase(courseReopo)
const  addCourseUseCase = new AddCourseUseCase(courseReopo)
const applyTeacherUseCase = new ApplyTeacherUseCase(UserRepository)

router.get('/profile', authMiddleware,adaptGetTeacherProfile(getTeacherProfileUseCase));
router.put('/profile', authMiddleware,adaptUpdateTeacherProfile(updateTeacherProfileUseCase));
router.get('/courses',authMiddleware,adaptGetTeacherCourses(getTeacherCoursUseCase))
router.post('/courses', authMiddleware, uploadCourseMedia, adaptAddCourse(addCourseUseCase));
router.post('/apply', authMiddleware, adaptApplyTeacher(applyTeacherUseCase));



export default router;