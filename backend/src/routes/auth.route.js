import express from 'express';
import {login, signup, logout, checkAuth, updateProfile} from '../controllers/auth.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);


// Protegemos la ruta con el middleware protectRoute porque solo el usuario logueado puede actualizar su perfil
router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);


export default router;