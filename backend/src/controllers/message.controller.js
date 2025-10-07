import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';

// Hacemos la función para obtener los usuarios para la sidebar porque el sidebar se muestra en el chat y el chat se muestra en el sidebar

export const getUsersForSidebar = async (req, res) => {
    try {
        // Obtenemos el id del usuario logueado
        const loggedInUserId = req.user._id;

        // Obtenemos los usuarios excepto el usuario logueado y seleccionamos solo el nombre y el perfil de los usuarios
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error getting users for sidebar:", error.message);
        res.status(500).json({ message: 'Error getting users for sidebar' });
    }
}


export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const MyId = req.user._id;
        // Buscamos los mensajes entre el usuario logueado y el usuario con el que se está chateando
        const messages = await Message.find({
            // Usamos el operador $or para buscar los mensajes entre el usuario logueado y el usuario con el que se está chateando
            $or: [
                { senderId: MyId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: MyId }
            ]
        });
        res.status(200).json(messages);
   
    } catch (error) {
        console.log("Error getting messages:", error.message);
        res.status(500).json({ message: 'Error getting messages' });
    }
}

//Funcion para enviar mensajes entre dos usuarios
export const sendMessage = async (req, res) => {
    try {

        const {id:userToChatId} = req.params;
        const MyId = req.user._id;
        const {text, image} = req.body;

        let imageUrl;

        // Si hay una imagen, la subimos a cloudinary
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Creamos el mensaje usando el modelo Message
        const newMessage = new Message({
            senderId: MyId,
            receiverId: userToChatId,
            text,
            image: imageUrl });

        // Guardamos el mensaje en la base de datos
        await newMessage.save();
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error sending message:", error.message);
        res.status(500).json({ message: 'Error sending message' });
    }
}