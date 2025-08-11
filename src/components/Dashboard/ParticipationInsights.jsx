import { useEffect } from "react";
import { useSelector } from "react-redux";
import useParticipation from "../../hooks/useParticipation";

const ParticipationInsights = ({ classroomId }) => {
  const { user } = useSelector((state) => state.auth);
  const {
    metrics,
    topParticipants,
    isLoading,
    error,
    fetchMetrics,
    fetchTopParticipants,
    clearError,
  } = useParticipation(classroomId);

  useEffect(() => {
    if (classroomId && user?.role === "teacher") {
      fetchMetrics();
      fetchTopParticipants();
    }
  }, [classroomId, user, fetchMetrics, fetchTopParticipants]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Mock data for demonstration when no real data is available
  const mockMetrics = {
    activeParticipants: 23,
    totalQuestions: 17,
    totalFiles: 12,
    avgAttention: 87,
  };

  const mockTopParticipants = [
    {
      userId: "1",
      userName: "Emma Wilson",
      totalEngagements: 23,
      engagementScore: 92,
    },
    {
      userId: "2",
      userName: "Alex Chen",
      totalEngagements: 19,
      engagementScore: 85,
    },
    {
      userId: "3",
      userName: "Michael Brown",
      totalEngagements: 15,
      engagementScore: 78,
    },
  ];

  const displayMetrics =
    Object.keys(metrics).length > 0 ? metrics : mockMetrics;
  const displayTopParticipants =
    topParticipants.length > 0 ? topParticipants : mockTopParticipants;

  const metricCards = [
    {
      title: "Active Participants",
      value: displayMetrics.activeParticipants,
      icon: "fas fa-users",
      color: "from-primary-500 to-primary-600",
      change: "+15%",
      changeColor: "text-green-500",
    },
    {
      title: "Questions Asked",
      value: displayMetrics.totalQuestions,
      icon: "fas fa-question-circle",
      color: "from-green-500 to-green-600",
      change: "+8%",
      changeColor: "text-green-500",
    },
    {
      title: "Files Shared",
      value: displayMetrics.totalFiles,
      icon: "fas fa-file-upload",
      color: "from-yellow-500 to-yellow-600",
      change: "+25%",
      changeColor: "text-green-500",
    },
    {
      title: "Avg. Attention",
      value: `${displayMetrics.avgAttention}%`,
      icon: "fas fa-eye",
      color: "from-purple-500 to-purple-600",
      change: "+5%",
      changeColor: "text-green-500",
    },
  ];

  if (user?.role !== "teacher") {
    return (
      <div className="glass-effect rounded-2xl p-6 shadow-xl">
        <div className="text-center py-8">
          <i className="fas fa-lock text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Teacher Only
          </h3>
          <p className="text-gray-600">
            This dashboard is only available to teachers.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-300 rounded-xl h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="glass-effect rounded-3xl p-6 shadow-2xl animate-bounce-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-chart-line text-green-500 mr-3 pulse-glow"></i>
          Participation Dashboard
        </h3>
        <div className="flex items-center space-x-4">
          <select className="bg-white/60 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>This Session</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
          <button className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-4 py-2 rounded-lg button-glow font-medium">
            <i className="fas fa-download mr-2"></i>Export Report
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-6 text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${metric.color} rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{metric.title}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </div>
              <i className={`${metric.icon} text-white/60 text-2xl`}></i>
            </div>
            <div className="mt-2 text-white/80 text-sm">
              <span className={metric.changeColor}>↗ {metric.change}</span> vs
              last session
            </div>
          </div>
        ))}
      </div>

      {/* Top Participants */}
      <div className="bg-white/60 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Top Participants
        </h4>
        <div className="space-y-3">
          {displayTopParticipants.map((participant, index) => {
            const avatarColors = [
              "from-green-500 to-cyan-500",
              "from-primary-500 to-secondary-500",
              "from-yellow-500 to-orange-500",
            ];
            const progressColors = [
              "from-green-500 to-cyan-500",
              "from-primary-500 to-secondary-500",
              "from-yellow-500 to-orange-500",
            ];

            return (
              <div
                key={participant.userId || index}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${
                      avatarColors[index % avatarColors.length]
                    } rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white text-sm font-bold">
                      {participant.userName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {participant.userName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {participant.totalEngagements} interactions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${
                        progressColors[index % progressColors.length]
                      } h-2 rounded-full transition-all`}
                      style={{ width: `${participant.engagementScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {participant.engagementScore}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="w-full mt-4 text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors">
          View All Participants <i className="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
    </section>
  );
};

export default ParticipationInsights;
