import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metrics: {
    totalParticipants: 0,
    activeParticipants: 0,
    totalQuestions: 0,
    totalFiles: 0,
    totalEngagements: 0,
    avgEngagement: 0,
  },
  topParticipants: [],
  engagementOverTime: [],
  participationData: [],
  isLoading: false,
  error: null,
  selectedTimeRange: "1hour",
};

const participationSlice = createSlice({
  name: "participation",
  initialState,
  reducers: {
    setMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
      state.isLoading = false;
    },
    setTopParticipants: (state, action) => {
      state.topParticipants = action.payload;
    },
    setEngagementOverTime: (state, action) => {
      state.engagementOverTime = action.payload;
    },
    setParticipationData: (state, action) => {
      state.participationData = action.payload;
    },
    setParticipantsRealtime: (state, action) => {
      state.participationData = action.payload;
    },
    updateParticipantEngagement: (state, action) => {
      const { userId, engagement } = action.payload;
      const participantIndex = state.participationData.findIndex(
        (p) => p.userId === userId
      );
      if (participantIndex !== -1) {
        state.participationData[participantIndex] = {
          ...state.participationData[participantIndex],
          ...engagement,
        };
      } else {
        state.participationData.push({ userId, ...engagement });
      }
    },
    incrementMetric: (state, action) => {
      const { metric, value = 1 } = action.payload;
      if (state.metrics[metric] !== undefined) {
        state.metrics[metric] += value;
      }
    },
    setSelectedTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload;
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
    resetMetrics: (state) => {
      state.metrics = initialState.metrics;
      state.topParticipants = [];
      state.engagementOverTime = [];
      state.participationData = [];
    },
  },
});

export const {
  setMetrics,
  setTopParticipants,
  setEngagementOverTime,
  setParticipationData,
  setParticipantsRealtime,
  updateParticipantEngagement,
  incrementMetric,
  setSelectedTimeRange,
  setLoading,
  setError,
  clearError,
  resetMetrics,
} = participationSlice.actions;

export default participationSlice.reducer;
