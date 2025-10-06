import {v2 as cloudinary} from 'cloudinary';
import {config} from 'dotenv';


//Usamos esto porque en el archivo .env tenemos las variables de entorno para cloudinary y si no lo hacemos, nos dará un error de que no se encuentra la variable de entorno
config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;