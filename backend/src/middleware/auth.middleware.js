import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
    const token = req.cookies.jwt;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Verificamos el token con el secret key que se encuentra en el archivo .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Controlamos si el token es válido
    if(!decoded) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    // Buscamos el usuario en la base de datos usando el id que se encuentra en el token
    const user = await User.findById(decoded.id).select('-password');

    // Controlamos si el usuario existe en la base de datos
    if(!user) {
        return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    // Pasamos el usuario al siguiente middleware
    req.user = user;

    // Pasamos al siguiente middleware
    next()
    
    }
    catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: 'Error en el middleware protectRoute' });
        // End of try-catch
        next();
    }
};
