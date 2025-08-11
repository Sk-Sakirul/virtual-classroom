import {
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase.js";

class ParticipationService {
  async trackEngagement(classroomId, userId, engagementData) {
    try {
      const participationRef = doc(
        db,
        "classrooms",
        classroomId,
        "participation",
        userId
      );

      await updateDoc(participationRef, {
        userId: userId,
        lastEngagement: serverTimestamp(),
        totalEngagements: increment(1),
        ...engagementData,
      });
    } catch (error) {
      throw new Error(`Failed to track engagement: ${error.message}`);
    }
  }

  async trackQuestion(classroomId, userId) {
    try {
      const participationRef = doc(
        db,
        "classrooms",
        classroomId,
        "participation",
        userId
      );

      await updateDoc(participationRef, {
        questionsAsked: increment(1),
        lastQuestionAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to track question:", error);
    }
  }

  async trackFileShare(classroomId, userId) {
    try {
      const participationRef = doc(
        db,
        "classrooms",
        classroomId,
        "participation",
        userId
      );

      await updateDoc(participationRef, {
        filesShared: increment(1),
        lastFileShareAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to track file share:", error);
    }
  }

  async trackWhiteboardInteraction(classroomId, userId) {
    try {
      const participationRef = doc(
        db,
        "classrooms",
        classroomId,
        "participation",
        userId
      );

      await updateDoc(participationRef, {
        whiteboardInteractions: increment(1),
        lastWhiteboardAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to track whiteboard interaction:", error);
    }
  }

  async getParticipationMetrics(classroomId) {
    try {
      const participationRef = collection(
        db,
        "classrooms",
        classroomId,
        "participation"
      );
      const snapshot = await getDocs(participationRef);

      let totalParticipants = 0;
      let activeParticipants = 0;
      let totalQuestions = 0;
      let totalFiles = 0;
      let totalEngagements = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalParticipants++;

        if (
          data.lastEngagement &&
          this.isRecentActivity(data.lastEngagement.toDate())
        ) {
          activeParticipants++;
        }

        totalQuestions += data.questionsAsked || 0;
        totalFiles += data.filesShared || 0;
        totalEngagements += data.totalEngagements || 0;
      });

      return {
        totalParticipants,
        activeParticipants,
        totalQuestions,
        totalFiles,
        totalEngagements,
        avgEngagement:
          totalParticipants > 0
            ? Math.round((totalEngagements / totalParticipants) * 100) / 100
            : 0,
      };
    } catch (error) {
      throw new Error(`Failed to get participation metrics: ${error.message}`);
    }
  }

  async getTopParticipants(classroomId, limitCount = 10) {
    try {
      const participationRef = collection(
        db,
        "classrooms",
        classroomId,
        "participation"
      );
      const q = query(
        participationRef,
        orderBy("totalEngagements", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
        lastEngagement: doc.data().lastEngagement?.toDate(),
        engagementScore: this.calculateEngagementScore(doc.data()),
      }));
    } catch (error) {
      throw new Error(`Failed to get top participants: ${error.message}`);
    }
  }

  calculateEngagementScore(participationData) {
    const weights = {
      totalEngagements: 1,
      questionsAsked: 5,
      filesShared: 3,
      whiteboardInteractions: 2,
    };

    let score = 0;
    score +=
      (participationData.totalEngagements || 0) * weights.totalEngagements;
    score += (participationData.questionsAsked || 0) * weights.questionsAsked;
    score += (participationData.filesShared || 0) * weights.filesShared;
    score +=
      (participationData.whiteboardInteractions || 0) *
      weights.whiteboardInteractions;

    return Math.min(score, 100); // Cap at 100%
  }

  isRecentActivity(lastActivity, minutesThreshold = 5) {
    const now = new Date();
    const diffInMinutes = (now - lastActivity) / (1000 * 60);
    return diffInMinutes <= minutesThreshold;
  }

  async getEngagementOverTime(classroomId, timeRange = "1hour") {
    // This would return time-series data for charts
    // For now, returning mock data structure
    const intervals = this.getTimeIntervals(timeRange);

    // In a real implementation, you'd query Firestore for engagement data
    // grouped by time intervals
    return intervals.map((interval) => ({
      timestamp: interval,
      engagementLevel: Math.floor(Math.random() * 100) + 1, // Mock data
      activeUsers: Math.floor(Math.random() * 25) + 1,
    }));
  }

  getTimeIntervals(range) {
    const now = new Date();
    const intervals = [];

    switch (range) {
      case "1hour":
        for (let i = 11; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
          intervals.push(time);
        }
        break;
      case "1day":
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Hourly intervals
          intervals.push(time);
        }
        break;
      default:
        intervals.push(now);
    }

    return intervals;
  }

  subscribeToParticipationMetrics(classroomId, callback) {
    const participationRef = collection(
      db,
      "classrooms",
      classroomId,
      "participation"
    );

    return onSnapshot(participationRef, (snapshot) => {
      const participants = snapshot.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
        lastEngagement: doc.data().lastEngagement?.toDate(),
      }));

      callback(participants);
    });
  }
}

export default new ParticipationService();
