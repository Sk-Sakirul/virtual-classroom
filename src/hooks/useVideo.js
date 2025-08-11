import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  toggleRaiseHand,
  joinSession,
  leaveSessionThunk,
} from "../features/video/videoThunks.js";
import {
  setParticipants,
  setSessionDuration,
  setInSession,
  clearError,
} from "../features/video/videoSlice.js";
import videoService from "../services/videoService.js";

export const useVideo = (classroomId) => {
  const dispatch = useDispatch();
  const videoState = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth);

  // Subscribe to participants
  useEffect(() => {
    if (!classroomId) return;

    const unsubscribe = videoService.subscribeToParticipants(
      classroomId,
      (participants) => {
        dispatch(setParticipants(participants));
      }
    );

    return () => unsubscribe();
  }, [classroomId, dispatch]);

  // Session duration timer
  useEffect(() => {
    let interval;

    if (videoState.isInSession) {
      interval = setInterval(() => {
        dispatch(setSessionDuration(videoState.sessionDuration + 1));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoState.isInSession, videoState.sessionDuration, dispatch]);

  const joinVideoSession = useCallback(async () => {
    if (!user) return;

    try {
      await dispatch(
        joinSession({
          classroomId,
          userData: user,
        })
      );
      dispatch(setInSession(true));
    } catch (error) {
      console.error("Failed to join session:", error);
    }
  }, [dispatch, classroomId, user]);

  const leaveVideoSession = useCallback(async () => {
    if (!user) return;

    try {
      await dispatch(
        leaveSessionThunk({
          classroomId,
          userId: user.uid,
        })
      );
      dispatch(setInSession(false));
    } catch (error) {
      console.error("Failed to leave session:", error);
    }
  }, [dispatch, classroomId, user]);

  const muteToggle = useCallback(() => {
    if (!user) return;

    const newMutedState = !videoState.isMuted;
    dispatch(
      toggleMute({
        classroomId,
        userId: user.uid,
        isMuted: newMutedState,
      })
    );
  }, [dispatch, classroomId, user, videoState.isMuted]);

  const videoToggle = useCallback(() => {
    if (!user) return;

    const newVideoState = !videoState.hasVideo;
    dispatch(
      toggleVideo({
        classroomId,
        userId: user.uid,
        hasVideo: newVideoState,
      })
    );
  }, [dispatch, classroomId, user, videoState.hasVideo]);

  const screenShareToggle = useCallback(() => {
    if (!user) return;

    const newScreenShareState = !videoState.isScreenSharing;
    dispatch(
      toggleScreenShare({
        classroomId,
        userId: user.uid,
        isScreenSharing: newScreenShareState,
      })
    );
  }, [dispatch, classroomId, user, videoState.isScreenSharing]);

  const raiseHandToggle = useCallback(() => {
    if (!user) return;

    const newRaisedHandState = !videoState.hasRaisedHand;
    dispatch(
      toggleRaiseHand({
        classroomId,
        userId: user.uid,
        hasRaisedHand: newRaisedHandState,
      })
    );
  }, [dispatch, classroomId, user, videoState.hasRaisedHand]);

  const clearVideoError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formatSessionDuration = useCallback((seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getParticipantInitials = useCallback((name) => {
    return videoService.getParticipantInitials(name);
  }, []);

  const getParticipantStatus = useCallback((participant) => {
    if (participant.isSpeaking)
      return { text: "Speaking", color: "bg-green-500" };
    if (participant.hasRaisedHand)
      return { text: "Hand Raised", color: "bg-yellow-500" };
    if (participant.isMuted) return { text: "Muted", color: "bg-red-500" };
    return { text: "Connected", color: "bg-gray-500" };
  }, []);

  return {
    ...videoState,
    joinSession: joinVideoSession,
    leaveSession: leaveVideoSession,
    toggleMute: muteToggle,
    toggleVideo: videoToggle,
    toggleScreenShare: screenShareToggle,
    toggleRaiseHand: raiseHandToggle,
    clearError: clearVideoError,
    formatSessionDuration,
    getParticipantInitials,
    getParticipantStatus,
  };
};

export default useVideo;
