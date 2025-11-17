import { Router } from 'express';
import { register, login, refreshToken, getProfile} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';


const router = Router();

router.post('/register', register);

// POST /api/auth/login 
router.post('/login', login);

router.post('/refresh', refreshToken);

router.get('/profile', authenticateToken, getProfile);

export default router;