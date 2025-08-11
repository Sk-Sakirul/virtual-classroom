const ParticipantStatus = ({ participant }) => {
  const getStatusIndicators = () => {
    const indicators = [];

    // Mute status
    if (participant.isMuted) {
      indicators.push({
        icon: "fas fa-microphone-slash",
        color: "text-red-400",
        title: "Muted",
      });
    } else {
      indicators.push({
        icon: "fas fa-microphone",
        color: "text-green-400",
        title: "Unmuted",
      });
    }

    // Video status
    if (participant.hasVideo) {
      indicators.push({
        icon: "fas fa-video",
        color: "text-primary-400",
        title: "Camera On",
      });
    } else {
      indicators.push({
        icon: "fas fa-video-slash",
        color: "text-gray-400",
        title: "Camera Off",
      });
    }

    // Raised hand
    if (participant.hasRaisedHand) {
      indicators.push({
        icon: "fas fa-hand-paper",
        color: "text-yellow-400",
        title: "Hand Raised",
        animate: "animate-bounce-gentle",
      });
    }

    // Screen sharing
    if (participant.isScreenSharing) {
      indicators.push({
        icon: "fas fa-share-screen",
        color: "text-blue-400",
        title: "Sharing Screen",
      });
    }

    return indicators;
  };

  const indicators = getStatusIndicators();

  return (
    <div className="flex items-center space-x-1">
      {indicators.map((indicator, index) => (
        <i
          key={index}
          className={`${indicator.icon} ${indicator.color} text-xs ${
            indicator.animate || ""
          }`}
          title={indicator.title}
        ></i>
      ))}
    </div>
  );
};

export default ParticipantStatus;
