import {
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase.js";

class VideoService {
  async updateParticipantStatus(classroomId, userId, status) {
    try {
      const participantRef = doc(
        db,
        "classrooms",
        classroomId,
        "participants",
        userId
      );

      await updateDoc(participantRef, {
        ...status,
        lastActive: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }

  subscribeToParticipants(classroomId, callback) {
    const participantsRef = collection(
      db,
      "classrooms",
      classroomId,
      "participants"
    );
    const q = query(participantsRef, where("isActive", "==", true));

    return onSnapshot(q, (snapshot) => {
      const participants = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.toDate(),
      }));
      callback(participants);
    });
  }

  async toggleMute(classroomId, userId, isMuted) {
    try {
      await this.updateParticipantStatus(classroomId, userId, {
        isMuted: isMuted,
        isSpeaking: false,
      });
    } catch (error) {
      throw new Error(`Failed to toggle mute: ${error.message}`);
    }
  }

  async toggleVideo(classroomId, userId, hasVideo) {
    try {
      await this.updateParticipantStatus(classroomId, userId, {
        hasVideo: hasVideo,
      });
    } catch (error) {
      throw new Error(`Failed to toggle video: ${error.message}`);
    }
  }

  async toggleScreenShare(classroomId, userId, isScreenSharing) {
    try {
      await this.updateParticipantStatus(classroomId, userId, {
        isScreenSharing: isScreenSharing,
      });
    } catch (error) {
      throw new Error(`Failed to toggle screen share: ${error.message}`);
    }
  }

  async raiseHand(classroomId, userId, hasRaisedHand) {
    try {
      await this.updateParticipantStatus(classroomId, userId, {
        hasRaisedHand: hasRaisedHand,
        handRaisedAt: hasRaisedHand ? serverTimestamp() : null,
      });
    } catch (error) {
      throw new Error(`Failed to raise hand: ${error.message}`);
    }
  }

  async setSpeakingStatus(classroomId, userId, isSpeaking) {
    try {
      await this.updateParticipantStatus(classroomId, userId, {
        isSpeaking: isSpeaking,
      });
    } catch (error) {
      console.error("Failed to update speaking status:", error);
    }
  }

  async leaveSession(classroomId, userId) {
    try {
      const participantRef = doc(
        db,
        "classrooms",
        classroomId,
        "participants",
        userId
      );

      await updateDoc(participantRef, {
        isActive: false,
        leftAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Failed to leave session: ${error.message}`);
    }
  }

  async joinSession(classroomId, userData) {
    try {
      const participantRef = doc(
        db,
        "classrooms",
        classroomId,
        "participants",
        userData.uid
      );

      await updateDoc(participantRef, {
        userId: userData.uid,
        userName: userData.displayName,
        userEmail: userData.email,
        userRole: userData.role,
        isActive: true,
        isMuted: true,
        hasVideo: false,
        isScreenSharing: false,
        hasRaisedHand: false,
        isSpeaking: false,
        joinedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Failed to join session: ${error.message}`);
    }
  }

  // Mock video stream management (in a real app, you'd use WebRTC)
  generateMockVideoStream(participantId) {
    return {
      id: participantId,
      active: true,
      video: true,
      audio: true,
    };
  }

  getParticipantInitials(name) {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusColor(participant) {
    if (participant.isSpeaking) return "bg-green-500";
    if (participant.hasRaisedHand) return "bg-yellow-500";
    if (participant.isMuted) return "bg-red-500";
    return "bg-gray-500";
  }
}

export default new VideoService();
