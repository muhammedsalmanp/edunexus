import { Router } from 'express';
import { adaptRegisterRoute } from '../../adapters/expressRouteAdapter';
import { RegisterUserUseCase } from '../../../app/useCase/user/RegisterUserUseCase';

const router = Router();

router.post('/register', adaptRegisterRoute(new RegisterUserUseCase({} as any)));

export default router;