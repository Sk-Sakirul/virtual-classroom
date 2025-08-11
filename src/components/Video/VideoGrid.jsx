import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useVideo from "../../hooks/useVideo.js";
import VideoControls from "./VideoControls.jsx";
import ParticipantStatus from "./ParticipantStatus.jsx";

const VideoGrid = ({ classroomId }) => {
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const {
    participants,
    isInSession,
    sessionDuration,
    isMuted,
    hasVideo,
    isScreenSharing,
    hasRaisedHand,
    joinSession,
    leaveSession,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleRaiseHand,
    formatSessionDuration,
    getParticipantInitials,
    // getParticipantStatus,
  } = useVideo(classroomId);

  useEffect(() => {
    // Auto-join session when component mounts
    if (user && !isInSession) {
      joinSession();
      setSessionStartTime(new Date());
    }
  }, [user, isInSession, joinSession]);

  // Mock participants data when no real participants
  const mockParticipants = [
    {
      id: "teacher-1",
      userName: "Dr. Sarah Johnson",
      userRole: "teacher",
      isMuted: false,
      hasVideo: true,
      isScreenSharing: false,
      hasRaisedHand: false,
      isSpeaking: true,
      isActive: true,
    },
    {
      id: "student-1",
      userName: "Alex Chen",
      userRole: "student",
      isMuted: true,
      hasVideo: true,
      isScreenSharing: false,
      hasRaisedHand: true,
      isSpeaking: false,
      isActive: true,
    },
    {
      id: "student-2",
      userName: "Emma Wilson",
      userRole: "student",
      isMuted: false,
      hasVideo: true,
      isScreenSharing: false,
      hasRaisedHand: false,
      isSpeaking: false,
      isActive: true,
    },
    {
      id: "student-3",
      userName: "Michael Brown",
      userRole: "student",
      isMuted: true,
      hasVideo: true,
      isScreenSharing: false,
      hasRaisedHand: false,
      isSpeaking: false,
      isActive: true,
    },
  ];

  const displayParticipants =
    participants.length > 0 ? participants : mockParticipants;
  const teacherParticipant = displayParticipants.find(
    (p) => p.userRole === "teacher"
  );
  const studentParticipants = displayParticipants.filter(
    (p) => p.userRole === "student"
  );

  const getParticipantVideoElement = (participant) => {
    // In a real implementation, this would return actual video streams
    // For now, we'll show placeholder images
    const avatarColor = participant.id?.includes("teacher")
      ? "from-yellow-500 to-orange-500"
      : "from-blue-500 to-purple-500";

    return (
      <div
        className={`relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden group video-tile ${
          participant.isSpeaking ? "speaking" : ""
        }`}
      >
        {/* Mock Video Feed */}
        <div
          className={`w-full h-full bg-gradient-to-br ${avatarColor} opacity-20`}
        ></div>

        {/* Participant Avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-16 h-16 bg-gradient-to-r ${avatarColor} rounded-full flex items-center justify-center shadow-2xl interactive-hover ring-4 ring-white/20`}
          >
            <span className="text-white text-xl font-bold">
              {getParticipantInitials(participant.userName)}
            </span>
          </div>
        </div>

        {/* Participant Info Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              {participant.userRole === "teacher" && (
                <i className="fas fa-crown text-yellow-400 mr-1"></i>
              )}
              {participant.userName}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <ParticipantStatus participant={participant} />
          </div>
        </div>

        {/* Speaking Indicator */}
        {participant.isSpeaking && (
          <div className="absolute top-2 left-2">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-bounce-gentle">
              <i className="fas fa-microphone-alt mr-1"></i>Speaking
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="glass-effect rounded-3xl p-6 shadow-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-video text-primary-500 mr-3 pulse-glow"></i>
          Live Session
        </h2>
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce-in">
            <i className="fas fa-circle mr-1 text-xs animate-ping"></i>
            LIVE
          </span>
          <span className="text-gray-600 text-sm">
            {formatSessionDuration(sessionDuration)}
          </span>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Teacher's Main Video */}
        {teacherParticipant && (
          <div className="lg:col-span-2">
            <div className="h-64 lg:h-80">
              {getParticipantVideoElement(teacherParticipant)}
            </div>
          </div>
        )}

        {/* Participants Grid */}
        <div className="space-y-4">
          {studentParticipants.slice(0, 3).map((participant) => (
            <div key={participant.id} className="h-24">
              {getParticipantVideoElement(participant)}
            </div>
          ))}

          {/* More Participants Button */}
          {displayParticipants.length > 4 && (
            <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-all group">
              <div className="text-center">
                <i className="fas fa-plus text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                <p className="text-xs">
                  View All ({displayParticipants.length})
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Video Controls */}
      <VideoControls
        classroomId={classroomId}
        isMuted={isMuted}
        hasVideo={hasVideo}
        isScreenSharing={isScreenSharing}
        hasRaisedHand={hasRaisedHand}
        participantCount={displayParticipants.length}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleRaiseHand={toggleRaiseHand}
        onLeaveSession={leaveSession}
      />
    </section>
  );
};

export default VideoGrid;
