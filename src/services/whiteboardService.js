import {
  doc,
  updateDoc,
  setDoc,
  getDoc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";

class WhiteboardService {
  async saveDrawingData(classroomId, drawingData, userId) {
    try {
      const whiteboardRef = doc(
        db,
        "classrooms",
        classroomId,
        "whiteboard",
        "canvas"
      );

      const drawingEntry = {
        ...drawingData,
        userId: userId,
        timestamp: Date.now(),
      };

      const docSnap = await getDoc(whiteboardRef);

      if (docSnap.exists()) {
        await updateDoc(whiteboardRef, {
          drawings: arrayUnion(drawingEntry),
          lastModified: serverTimestamp(),
          lastModifiedBy: userId,
        });
      } else {
        await setDoc(whiteboardRef, {
          drawings: [drawingEntry],
          lastModified: serverTimestamp(),
          lastModifiedBy: userId,
        });
      }
    } catch (error) {
      throw new Error(`Failed to save drawing: ${error.message}`);
    }
  }

  subscribeToWhiteboard(classroomId, callback) {
    const whiteboardRef = doc(
      db,
      "classrooms",
      classroomId,
      "whiteboard",
      "canvas"
    );

    return onSnapshot(whiteboardRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          drawings: data.drawings || [],
          lastModified: data.lastModified?.toDate(),
          lastModifiedBy: data.lastModifiedBy,
        });
      }
    });
  }

  async clearWhiteboard(classroomId, userId) {
    try {
      const whiteboardRef = doc(
        db,
        "classrooms",
        classroomId,
        "whiteboard",
        "canvas"
      );

      const docSnap = await getDoc(whiteboardRef);

      if (docSnap.exists()) {
        await updateDoc(whiteboardRef, {
          drawings: [],
          lastModified: serverTimestamp(),
          lastModifiedBy: userId,
          cleared: true,
          clearedAt: serverTimestamp(),
        });
      } else {
        await setDoc(whiteboardRef, {
          drawings: [],
          lastModified: serverTimestamp(),
          lastModifiedBy: userId,
          cleared: true,
          clearedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      throw new Error(`Failed to clear whiteboard: ${error.message}`);
    }
  }

  async undoLastAction(classroomId, userId) {
    try {
      const whiteboardRef = doc(
        db,
        "classrooms",
        classroomId,
        "whiteboard",
        "canvas"
      );

      const docSnap = await getDoc(whiteboardRef);

      if (docSnap.exists()) {
        await updateDoc(whiteboardRef, {
          lastModified: serverTimestamp(),
          lastModifiedBy: userId,
          action: "undo",
        });
      } else {
        await setDoc(whiteboardRef, {
          lastModified: serverTimestamp(),
          lastModifiedBy: userId,
          action: "undo",
        });
      }
    } catch (error) {
      throw new Error(`Failed to undo action: ${error.message}`);
    }
  }

  async saveWhiteboardState(classroomId, canvasData, userId) {
    try {
      const whiteboardRef = doc(
        db,
        "classrooms",
        classroomId,
        "whiteboard",
        "canvas"
      );

      const docSnap = await getDoc(whiteboardRef);

      if (docSnap.exists()) {
        await updateDoc(whiteboardRef, {
          canvasData: canvasData,
          savedAt: serverTimestamp(),
          savedBy: userId,
        });
      } else {
        await setDoc(whiteboardRef, {
          canvasData: canvasData,
          savedAt: serverTimestamp(),
          savedBy: userId,
        });
      }
    } catch (error) {
      throw new Error(`Failed to save whiteboard: ${error.message}`);
    }
  }

  generateDrawingId() {
    return `draw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new WhiteboardService();
