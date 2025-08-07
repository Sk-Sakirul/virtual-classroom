import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import {db} from "./firebase";

const chatCollectionRef = collection(db, "messages");

const getMessages = async () => {
    const q = query(chatCollectionRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

const sendMessage = async ({text, sender}) => {
    const newMessage = {
        text,
        sender,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(chatCollectionRef, newMessage);
    return {id: docRef.id, ...newMessage};
}

const chatService = {getMessages, sendMessage};

export default chatService;