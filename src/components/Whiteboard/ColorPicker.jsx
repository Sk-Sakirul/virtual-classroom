import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentColor } from "../../features/whiteboard/whiteboardSlice";

const ColorPicker = ({ currentColor, onInteraction }) => {
  const [showCustomColors, setShowCustomColors] = useState(false);
  const dispatch = useDispatch();

  const presetColors = [
    "#000000", // Black
    "#FF0000", // Red
    "#0000FF", // Blue
    "#00FF00", // Green
    "#FFFF00", // Yellow
    "#800080", // Purple
    "#FFA500", // Orange
    "#FFC0CB", // Pink
    "#A52A2A", // Brown
    "#808080", // Gray
    "#FFFFFF", // White
    "#00FFFF", // Cyan
  ];

  const handleColorChange = (color) => {
    dispatch(setCurrentColor(color));
    onInteraction?.();
  };

  const handleCustomColorChange = (e) => {
    handleColorChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Preset Colors */}
      {presetColors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange(color)}
          className={`w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform shadow-sm ${
            currentColor === color
              ? "border-gray-600 scale-110"
              : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
          title={`Color: ${color}`}
        />
      ))}

      {/* Custom Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowCustomColors(!showCustomColors)}
          className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform shadow-sm flex items-center justify-center bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
          title="Custom Color"
        >
          <i className="fas fa-palette text-white text-xs"></i>
        </button>

        {showCustomColors && (
          <div className="absolute top-10 left-0 z-10 bg-white rounded-lg shadow-lg p-2 border">
            <input
              type="color"
              value={currentColor}
              onChange={handleCustomColorChange}
              className="w-8 h-8 border-none cursor-pointer"
              title="Pick Custom Color"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
