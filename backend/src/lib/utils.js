import jwt from 'jsonwebtoken';

// Function to generate a JWT token

export const generateToken = (userId, res) => {

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );


    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Cookie not accessible via JavaScript
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development', // Set to true in production
        
    });
    return token;
}
