import { useState } from "react";
import { useSelector } from "react-redux";
import VideoGrid from "../components/Video/VideoGrid.jsx";
import Whiteboard from "../components/Whiteboard/Whiteboard.jsx";
import ChatBox from "../components/Chat/ChatBox.jsx";
import ParticipationInsights from "../components/Dashboard/ParticipationInsights.jsx";
import authService from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const Classroom = () => {
  const [activeTab, setActiveTab] = useState("video");
  const { user } = useSelector((state) => state.auth);
  const classroomId = "demo-classroom";

  const navigate = useNavigate();

  const tabs = [
    { id: "video", label: "Video", icon: "fas fa-video" },
    { id: "whiteboard", label: "Whiteboard", icon: "fas fa-paint-brush" },
    { id: "chat", label: "Chat", icon: "fas fa-comments" },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-chart-line",
      teacherOnly: true,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "video":
        return <VideoGrid classroomId={classroomId} />;
      case "whiteboard":
        return <Whiteboard classroomId={classroomId} />;
      case "chat":
        return <ChatBox classroomId={classroomId} />;
      case "dashboard":
        return <ParticipationInsights classroomId={classroomId} />;
      default:
        return <VideoGrid classroomId={classroomId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="backdrop-blur-md bg-white/70 shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-graduation-cap text-lg text-white"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Virtual Classroom
              </h1>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              {tabs.map((tab) => {
                if (tab.teacherOnly && user?.role !== "teacher") return null;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-white/30">
                  <span className="text-white text-sm font-semibold">
                    {user?.displayName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user?.role || "student"}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={async () => {
                  await authService.signOut();
                  navigate("/login");
                }}
                className="bg-red-100 hover:bg-red-500 text-red-600 hover:text-white px-3 py-2 rounded-xl transition-all duration-300 group"
                title="Sign Out"
              >
                <i className="fas fa-sign-out-alt group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="animate-fade-in">{renderTabContent()}</div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => {
            if (tab.teacherOnly && user?.role !== "teacher") return null;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  activeTab === tab.id ? "text-blue-500" : "text-gray-600"
                }`}
              >
                <i className={`${tab.icon} text-lg mb-1`}></i>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
