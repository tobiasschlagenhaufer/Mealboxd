import { Router, Request, Response } from 'express';
import { getAllRestaurants, autocompleteRestaurants, getRestaurantDetails } from '../controllers/restaurantController';

const router: Router = Router();

router.get('/', getAllRestaurants);

router.get('/autocomplete', autocompleteRestaurants);
router.get('/:placeId', getRestaurantDetails);

export default router;