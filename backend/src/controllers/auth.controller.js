import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import {generateToken} from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';



export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({_id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }


    } catch (error) {
        console.log("Error registering user:", error);
        res.status(500).send('Error registering user');
    }
    
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        // Controlamos si el usuario existe ne la base de datos
        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generamos un token para el usuario
        generateToken(user._id, res);
        res.status(200).json({_id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic });

    } catch (error) {
        console.log("Error logging in:", error.message);
        res.status(500).send('Error logging in');
    }
}

export const logout = (req, res) => {
    try {
        // Eliminamos el token de la cookie porque no queremos que el usuario siga logueado y por eso lo seteamos a 0
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'User logged out' });
    } catch (error) {
        console.log("Error logging out:", error.message);
        res.status(500).send('Error logging out');
    }
}

export const updateProfile = async (req, res) => {
    try {
        const  {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        // Controlamos si el usuario existe en la base de datos
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error updating profile:", error.message);
        res.status(500).json({ message: 'Error updating profile' });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error checking auth:", error.message);
        res.status(500).json({ message: 'Error checking auth' });
    }
}



