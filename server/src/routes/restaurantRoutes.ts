import { Router, Request, Response } from 'express';
import { getAllRestaurants, autocompleteRestaurants, getRestaurantDetails } from '../controllers/restaurantController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router: Router = Router();

router.get('/', getAllRestaurants);

router.get('/autocomplete', authenticateToken, autocompleteRestaurants);
router.get('/:placeId', authenticateToken, getRestaurantDetails);

export default router;