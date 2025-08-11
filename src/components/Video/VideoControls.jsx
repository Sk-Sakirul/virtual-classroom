import { useState } from "react";

const VideoControls = ({
  // classroomId,
  isMuted,
  hasVideo,
  isScreenSharing,
  hasRaisedHand,
  participantCount,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRaiseHand,
  onLeaveSession,
}) => {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleLeaveSession = () => {
    if (showLeaveConfirm) {
      onLeaveSession();
      setShowLeaveConfirm(false);
    } else {
      setShowLeaveConfirm(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setShowLeaveConfirm(false), 3000);
    }
  };

  const controlButtons = [
    {
      id: "mute",
      icon: isMuted ? "fas fa-microphone-slash" : "fas fa-microphone",
      label: isMuted ? "Unmute" : "Mute",
      active: !isMuted,
      color: isMuted
        ? "bg-red-500 hover:bg-red-600"
        : "bg-green-500 hover:bg-green-600",
      onClick: onToggleMute,
    },
    {
      id: "video",
      icon: hasVideo ? "fas fa-video" : "fas fa-video-slash",
      label: hasVideo ? "Turn Off Camera" : "Turn On Camera",
      active: hasVideo,
      color: hasVideo
        ? "bg-primary-500 hover:bg-primary-600"
        : "bg-gray-500 hover:bg-gray-600",
      onClick: onToggleVideo,
    },
    {
      id: "screen",
      icon: "fas fa-share-screen",
      label: isScreenSharing ? "Stop Sharing" : "Share Screen",
      active: isScreenSharing,
      color: isScreenSharing
        ? "bg-yellow-500 hover:bg-yellow-600"
        : "bg-yellow-500 hover:bg-yellow-600",
      onClick: onToggleScreenShare,
    },
    {
      id: "hand",
      icon: "fas fa-hand-paper",
      label: hasRaisedHand ? "Lower Hand" : "Raise Hand",
      active: hasRaisedHand,
      color: hasRaisedHand
        ? "bg-purple-500 hover:bg-purple-600"
        : "bg-purple-500 hover:bg-purple-600",
      onClick: onToggleRaiseHand,
      animate: hasRaisedHand ? "animate-bounce-gentle" : "",
    },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-white/30 rounded-xl">
      {/* Left Side - Leave and Participants */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLeaveSession}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
            showLeaveConfirm
              ? "bg-red-600 text-white animate-pulse"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          <i className="fas fa-phone-slash"></i>
          <span>{showLeaveConfirm ? "Click to Confirm" : "Leave Session"}</span>
        </button>

        <div className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg">
          <i className="fas fa-users"></i>
          <span>{participantCount}</span>
        </div>
      </div>

      {/* Right Side - Control Buttons */}
      <div className="flex items-center space-x-2">
        {controlButtons.map((button) => (
          <button
            key={button.id}
            onClick={button.onClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg ${
              button.color
            } ${button.animate || ""}`}
            title={button.label}
          >
            <i className={button.icon}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoControls;
