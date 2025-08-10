// src/services/chatService.js
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase.js";

class ChatService {
  // send a message (returns optimistic serializable payload)
  async sendMessage(
    classroomId,
    message,
    userId,
    userName,
    displayName,
    type = "text"
  ) {
    try {
      const messagesRef = collection(db, "classrooms", classroomId, "messages");

      const messageData = {
        text: message,
        userId,
        userName,
        displayName: displayName || userName,
        type,
        timestamp: serverTimestamp(), // server side timestamp in firestore
        edited: false,
        reactions: {},
      };

      const docRef = await addDoc(messagesRef, messageData);

      // return optimistic payload with serializable timestamp (ms)
      return {
        id: docRef.id,
        text: message,
        userId,
        userName,
        displayName: displayName || userName,
        type,
        timestamp: Date.now(), // serializable optimistic time
        edited: false,
        reactions: {},
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // subscribe to messages (real-time). callback receives messages with timestamp as millis
  subscribeToMessages(classroomId, callback) {
    const messagesRef = collection(db, "classrooms", classroomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((d) => {
        const data = d.data();
        const ts = data.timestamp;
        return {
          id: d.id,
          text: data.text,
          userId: data.userId,
          userName: data.userName,
          displayName: data.displayName,
          type: data.type,
          edited: !!data.edited,
          reactions: data.reactions || {},
          // convert Firestore Timestamp -> milliseconds (number)
          timestamp:
            ts && typeof ts.toMillis === "function"
              ? ts.toMillis()
              : ts || null,
        };
      });
      callback(messages);
    });
  }

  // set typing status: create/set doc when typing; delete doc when not typing
  async setTypingStatus(classroomId, userId, userName, isTyping) {
    try {
      const typingRef = doc(db, "classrooms", classroomId, "typing", userId);

      if (isTyping) {
        // ensures doc exists (create/merge)
        await setDoc(
          typingRef,
          {
            userId,
            userName,
            timestamp: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        // stop typing -> delete the doc so it doesn't clutter
        await deleteDoc(typingRef).catch(() => {
          // ignore if doc didn't exist
        });
      }
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  }

  // listen to typing users: callback receives array of users (userId, userName, timestampMs)
  subscribeToTypingUsers(classroomId, currentUserId, callback) {
    const typingRef = collection(db, "classrooms", classroomId, "typing");
    // subscribe to the collection (no where required because we delete on stop)
    return onSnapshot(typingRef, (snapshot) => {
      const now = Date.now();
      const users = snapshot.docs
        .map((d) => {
          const data = d.data();
          const ts = data.timestamp;
          const tsMs =
            ts && typeof ts.toMillis === "function" ? ts.toMillis() : ts || 0;
          return {
            userId: data.userId,
            userName: data.userName,
            timestamp: tsMs,
          };
        })
        // exclude the current user
        .filter((u) => u.userId !== currentUserId)
        // optional: only show recent typers (e.g., last 5s)
        .filter((u) => now - u.timestamp < 5000);

      callback(users);
    });
  }

  // share file (returns optimistic serializable payload)
  async shareFile(classroomId, fileData, userId, userName, displayName) {
    try {
      const messagesRef = collection(db, "classrooms", classroomId, "messages");

      const fileMessage = {
        text: `Shared file: ${fileData.name}`,
        userId,
        userName,
        displayName: displayName || userName,
        type: "file",
        fileData,
        timestamp: serverTimestamp(),
        edited: false,
        reactions: {},
      };

      const docRef = await addDoc(messagesRef, fileMessage);

      return {
        id: docRef.id,
        text: `Shared file: ${fileData.name}`,
        userId,
        userName,
        displayName: displayName || userName,
        type: "file",
        fileData,
        timestamp: Date.now(),
        edited: false,
        reactions: {},
      };
    } catch (error) {
      throw new Error(`Failed to share file: ${error.message}`);
    }
  }

  // get messages by type (1-time fetch). return timestamp ms
  async getMessagesByType(classroomId, type = null) {
    try {
      const messagesRef = collection(db, "classrooms", classroomId, "messages");
      let q;

      if (type) {
        q = query(messagesRef, orderBy("timestamp", "desc"));
        // if filtering by type you may want to do where('type','==', type) but ensure index
        // q = query(messagesRef, where("type", "==", type), orderBy("timestamp", "desc"));
      } else {
        q = query(messagesRef, orderBy("timestamp", "desc"));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => {
        const data = d.data();
        const ts = data.timestamp;
        return {
          id: d.id,
          text: data.text,
          userId: data.userId,
          userName: data.userName,
          displayName: data.displayName,
          type: data.type,
          edited: !!data.edited,
          reactions: data.reactions || {},
          timestamp:
            ts && typeof ts.toMillis === "function"
              ? ts.toMillis()
              : ts || null,
        };
      });
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }
}

export default new ChatService();
