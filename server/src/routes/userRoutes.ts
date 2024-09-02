import { Router } from 'express';
import { getAllUsers, getUserById, login, signup, getAllRestaurantRatings, rateRestaurant } from '../controllers/userController'
import { authenticateToken } from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/signup', signup);
router.post('/login', login);

// These should be authenticated
router.get('/ratings', authenticateToken, getAllRestaurantRatings);
router.post('/rating', authenticateToken, rateRestaurant);

router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;