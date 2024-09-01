import { Router, Request, Response } from 'express';
import { getAllUsers, getUserById, login, signup } from '../controllers/userController'

const router: Router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.post('/signup', signup);
router.post('/login', login);

export default router;