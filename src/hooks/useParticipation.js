import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  fetchParticipationMetrics,
  fetchTopParticipants as fetchTopParticipantsThunk,
  fetchEngagementOverTime,
  trackEngagement,
  trackQuestion,
  trackFileShare,
  trackWhiteboardInteraction,
} from "../features/participation/participationThunks.js";
import {
  setSelectedTimeRange,
  clearError,
  setParticipantsRealtime, // <-- Add this in your slice to handle RT updates
} from "../features/participation/participationSlice.js";
import participationService from "../services/participationService.js";

export const useParticipation = (classroomId) => {
  const dispatch = useDispatch();
  const participationState = useSelector((state) => state.participation);
  const { user } = useSelector((state) => state.auth);

  // Auto-fetch metrics
  useEffect(() => {
    if (classroomId && user?.role === "teacher") {
      dispatch(fetchParticipationMetrics({ classroomId }));
      dispatch(fetchTopParticipantsThunk({ classroomId }));
      dispatch(
        fetchEngagementOverTime({
          classroomId,
          timeRange: participationState.selectedTimeRange,
        })
      );
    }
  }, [classroomId, user, dispatch, participationState.selectedTimeRange]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!classroomId) return;

    const unsubscribe = participationService.subscribeToParticipationMetrics(
      classroomId,
      (participants) => {
        dispatch(setParticipantsRealtime(participants)); // ✅ update Redux
      }
    );

    return () => unsubscribe?.();
  }, [classroomId, dispatch]);

  const fetchMetrics = useCallback(() => {
    if (!classroomId) return;
    return dispatch(fetchParticipationMetrics({ classroomId }));
  }, [dispatch, classroomId]);

  const fetchTopParticipants = useCallback(
    (limit = 10) => {
      if (!classroomId) return;
      return dispatch(fetchTopParticipantsThunk({ classroomId, limit }));
    },
    [dispatch, classroomId]
  );

  const fetchEngagementData = useCallback(
    (timeRange = "1hour") => {
      if (!classroomId) return;
      return dispatch(fetchEngagementOverTime({ classroomId, timeRange }));
    },
    [dispatch, classroomId]
  );

  const trackUserEngagement = useCallback(
    (engagementData) => {
      if (!user || !classroomId) return;
      return dispatch(
        trackEngagement({ classroomId, userId: user.uid, engagementData })
      );
    },
    [dispatch, classroomId, user]
  );

  const trackUserQuestion = useCallback(() => {
    if (!user || !classroomId) return;
    return dispatch(trackQuestion({ classroomId, userId: user.uid }));
  }, [dispatch, classroomId, user]);

  const trackUserFileShare = useCallback(() => {
    if (!user || !classroomId) return;
    return dispatch(trackFileShare({ classroomId, userId: user.uid }));
  }, [dispatch, classroomId, user]);

  const trackUserWhiteboardInteraction = useCallback(() => {
    if (!user || !classroomId) return;
    return dispatch(
      trackWhiteboardInteraction({ classroomId, userId: user.uid })
    );
  }, [dispatch, classroomId, user]);

  const setTimeRange = useCallback(
    (timeRange) => {
      dispatch(setSelectedTimeRange(timeRange));
      if (classroomId) {
        dispatch(fetchEngagementOverTime({ classroomId, timeRange }));
      }
    },
    [dispatch, classroomId]
  );

  const clearParticipationError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const refreshData = useCallback(() => {
    if (!classroomId) return;
    return Promise.all([
      dispatch(fetchParticipationMetrics({ classroomId })),
      dispatch(fetchTopParticipantsThunk({ classroomId })),
      dispatch(
        fetchEngagementOverTime({
          classroomId,
          timeRange: participationState.selectedTimeRange,
        })
      ),
    ]);
  }, [dispatch, classroomId, participationState.selectedTimeRange]);

  const getEngagementLevel = useCallback(() => {
    const { metrics } = participationState;
    if (!metrics.totalParticipants) return "No Data";
    const engagementRatio =
      metrics.activeParticipants / metrics.totalParticipants;
    if (engagementRatio >= 0.8) return "High";
    if (engagementRatio >= 0.6) return "Medium";
    if (engagementRatio >= 0.4) return "Low";
    return "Very Low";
  }, [participationState.metrics]);

  const getEngagementColor = useCallback(() => {
    const level = getEngagementLevel();
    switch (level) {
      case "High":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-orange-600 bg-orange-100";
      case "Very Low":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }, [getEngagementLevel]);

  const getParticipationTrend = useCallback(() => {
    const { engagementOverTime } = participationState;
    if (engagementOverTime.length < 2) return { trend: "stable", change: 0 };

    const recent = engagementOverTime.slice(-3);
    const earlier = engagementOverTime.slice(-6, -3);
    if (recent.length === 0 || earlier.length === 0)
      return { trend: "stable", change: 0 };

    const recentAvg =
      recent.reduce((sum, p) => sum + p.engagementLevel, 0) / recent.length;
    const earlierAvg =
      earlier.reduce((sum, p) => sum + p.engagementLevel, 0) / earlier.length;

    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    if (Math.abs(change) < 5)
      return { trend: "stable", change: Math.round(change) };
    return change > 0
      ? { trend: "increasing", change: Math.round(change) }
      : { trend: "decreasing", change: Math.round(change) };
  }, [participationState.engagementOverTime]);

  const getSummaryStats = useCallback(() => {
    const { metrics, topParticipants } = participationState;
    return {
      totalParticipants: metrics.totalParticipants || 0,
      activeParticipants: metrics.activeParticipants || 0,
      engagementRate:
        metrics.totalParticipants > 0
          ? Math.round(
              (metrics.activeParticipants / metrics.totalParticipants) * 100
            )
          : 0,
      topPerformer: topParticipants[0]?.userName || "No data",
      totalInteractions: metrics.totalEngagements || 0,
      questionsAsked: metrics.totalQuestions || 0,
      filesShared: metrics.totalFiles || 0,
    };
  }, [participationState.metrics, participationState.topParticipants]);

  return {
    ...participationState,
    fetchMetrics,
    fetchTopParticipants,
    fetchEngagementData,
    trackEngagement: trackUserEngagement,
    trackQuestion: trackUserQuestion,
    trackFileShare: trackUserFileShare,
    trackWhiteboardInteraction: trackUserWhiteboardInteraction,
    setTimeRange,
    clearError: clearParticipationError,
    refreshData,
    getEngagementLevel,
    getEngagementColor,
    getParticipationTrend,
    getSummaryStats,
  };
};

export default useParticipation;
