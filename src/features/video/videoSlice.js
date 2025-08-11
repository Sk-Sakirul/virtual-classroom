import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  participants: [],
  localParticipant: null,
  isMuted: true,
  hasVideo: false,
  isScreenSharing: false,
  hasRaisedHand: false,
  isSpeaking: false,
  isInSession: false,
  sessionDuration: 0,
  isLoading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setParticipants: (state, action) => {
      state.participants = action.payload;
      state.isLoading = false;
    },
    addParticipant: (state, action) => {
      const existingParticipant = state.participants.find(
        (p) => p.id === action.payload.id
      );
      if (!existingParticipant) {
        state.participants.push(action.payload);
      }
    },
    updateParticipant: (state, action) => {
      const { id, updates } = action.payload;
      const participantIndex = state.participants.findIndex((p) => p.id === id);
      if (participantIndex !== -1) {
        state.participants[participantIndex] = {
          ...state.participants[participantIndex],
          ...updates,
        };
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(
        (p) => p.id !== action.payload
      );
    },
    setLocalParticipant: (state, action) => {
      state.localParticipant = action.payload;
    },
    setMuted: (state, action) => {
      state.isMuted = action.payload;
    },
    setVideo: (state, action) => {
      state.hasVideo = action.payload;
    },
    setScreenShare: (state, action) => {
      state.isScreenSharing = action.payload;
    },
    setRaisedHand: (state, action) => {
      state.hasRaisedHand = action.payload;
    },
    setSpeaking: (state, action) => {
      state.isSpeaking = action.payload;
    },
    setInSession: (state, action) => {
      state.isInSession = action.payload;
    },
    setSessionDuration: (state, action) => {
      state.sessionDuration = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    leaveSession: (state) => {
      state.participants = [];
      state.isInSession = false;
      state.sessionDuration = 0;
      state.isMuted = true;
      state.hasVideo = false;
      state.isScreenSharing = false;
      state.hasRaisedHand = false;
      state.isSpeaking = false;
    },
  },
});

export const {
  setParticipants,
  addParticipant,
  updateParticipant,
  removeParticipant,
  setLocalParticipant,
  setMuted,
  setVideo,
  setScreenShare,
  setRaisedHand,
  setSpeaking,
  setInSession,
  setSessionDuration,
  setLoading,
  setError,
  clearError,
  leaveSession,
} = videoSlice.actions;

export default videoSlice.reducer;
