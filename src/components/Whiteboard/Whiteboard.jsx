import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useWhiteboard from "../../hooks/useWhiteboard.js";
import { trackWhiteboardInteraction } from "../../features/participation/participationThunks.js";
import Canvas from "./Canvas.jsx";
import ToolsPanel from "./ToolsPanel.jsx";

const Whiteboard = ({ classroomId }) => {
  const dispatch = useDispatch();
  const {
    currentTool,
    currentColor,
    brushSize,
    drawings,
    collaborators,
    canUndo,
    canRedo,
    undo,
    redo,
    clearBoard,
    saveCanvas,
    error,
    clearError,
  } = useWhiteboard(classroomId);

  // Track whiteboard interaction for participation metrics
  const trackInteraction = () => {
    dispatch(
      trackWhiteboardInteraction({ classroomId, userId: "current-user-id" })
    );
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSaveBoard = async () => {
    try {
      const canvas = document.getElementById("whiteboard-canvas");
      if (canvas) {
        const canvasData = canvas.toDataURL();
        await saveCanvas(canvasData);
      }
    } catch (error) {
      console.error("Failed to save whiteboard:", error);
    }
  };

  return (
    <section className="glass-effect rounded-3xl p-6 shadow-2xl animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-paint-brush text-purple-500 mr-3 pulse-glow"></i>
          Interactive Whiteboard
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="text-gray-600 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="Undo (Ctrl+Z)"
          >
            <i className="fas fa-undo"></i>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="text-gray-600 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="Redo (Ctrl+Y)"
          >
            <i className="fas fa-redo"></i>
          </button>
          <button
            onClick={clearBoard}
            className="text-gray-600 hover:text-red-500 transition-colors p-2"
            title="Clear All"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {/* Tools Panel */}
      <ToolsPanel
        currentTool={currentTool}
        currentColor={currentColor}
        brushSize={brushSize}
        onInteraction={trackInteraction}
      />

      {/* Canvas Container */}
      <div className="relative bg-white rounded-2xl shadow-inner border-2 border-gray-100 overflow-hidden mb-4 whiteboard-canvas">
        <Canvas
          classroomId={classroomId}
          currentTool={currentTool}
          currentColor={currentColor}
          brushSize={brushSize}
          drawings={drawings}
          onInteraction={trackInteraction}
        />

        {/* Demo Content Overlay - shows when no drawings exist */}
        {drawings.length === 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-center text-gray-400 animate-bounce-in">
              <i className="fas fa-paint-brush text-6xl mb-4 floating-animation text-purple-300"></i>
              <p className="text-xl font-medium mb-2">
                Start drawing on the whiteboard
              </p>
              <p className="text-sm">Select a tool and begin collaborating</p>
            </div>
          </div>
        )}
      </div>

      {/* Collaboration Indicators */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {collaborators.length > 0 && (
            <>
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator, index) => (
                  <div
                    key={collaborator.userId || index}
                    className="w-6 h-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold"
                    title={collaborator.userName}
                  >
                    {collaborator.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {collaborators.length}{" "}
                {collaborators.length === 1 ? "person" : "people"} collaborating
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleSaveBoard}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
        >
          <i className="fas fa-save mr-2"></i>Save Board
        </button>
      </div>
    </section>
  );
};

export default Whiteboard;
