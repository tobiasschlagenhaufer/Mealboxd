import { Router, Request, Response } from 'express';
import { getAllRestaurants, getRestaurantById } from '../controllers/restaurantController';

const router: Router = Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

export default router;