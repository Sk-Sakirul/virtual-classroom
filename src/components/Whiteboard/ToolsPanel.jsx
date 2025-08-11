import { useDispatch } from "react-redux";
import {
  setCurrentTool,
  setBrushSize,
} from "../../features/whiteboard/whiteboardSlice.js";
import ColorPicker from "./ColorPicker.jsx";

const ToolsPanel = ({
  currentTool,
  currentColor,
  brushSize,
  onInteraction,
}) => {
  const dispatch = useDispatch();

  const tools = [
    { id: "pen", name: "Pen", icon: "fas fa-pen" },
    { id: "highlighter", name: "Highlighter", icon: "fas fa-highlighter" },
    { id: "eraser", name: "Eraser", icon: "fas fa-eraser" },
    { id: "shapes", name: "Shapes", icon: "fas fa-shapes" },
  ];

  const handleToolChange = (tool) => {
    dispatch(setCurrentTool(tool));
    onInteraction?.();
  };

  const handleBrushSizeChange = (e) => {
    dispatch(setBrushSize(parseInt(e.target.value)));
    onInteraction?.();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-white/40 rounded-xl">
      {/* Drawing Tools */}
      <div className="flex items-center space-x-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolChange(tool.id)}
            className={`w-10 h-10 rounded-lg transition-all shadow-md hover:scale-105 ${
              currentTool === tool.id
                ? "bg-primary-500 text-white"
                : "bg-gray-300 text-gray-600 hover:bg-gray-400"
            }`}
            title={tool.name}
          >
            <i className={tool.icon}></i>
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-gray-300 mx-2"></div>

      {/* Color Picker */}
      <ColorPicker currentColor={currentColor} onInteraction={onInteraction} />

      <div className="w-px h-8 bg-gray-300 mx-2"></div>

      {/* Brush Size */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={handleBrushSizeChange}
          className="w-20 accent-primary-500"
        />
        <span className="text-sm text-gray-600 w-8">{brushSize}px</span>
      </div>

      {/* Tool Info */}
      {currentTool && (
        <div className="ml-auto hidden md:flex items-center space-x-2 text-sm text-gray-600">
          <i className={tools.find((t) => t.id === currentTool)?.icon}></i>
          <span className="capitalize">{currentTool}</span>
          {currentTool !== "eraser" && (
            <>
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: currentColor }}
              ></div>
              <span>{brushSize}px</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsPanel;
