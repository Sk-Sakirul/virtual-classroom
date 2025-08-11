import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useWhiteboard from "../../hooks/useWhiteboard";

const Canvas = ({
  classroomId,
  currentTool,
  currentColor,
  brushSize,
  onInteraction,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { saveDrawing } = useWhiteboard(classroomId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Set default styles
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x:
        ((e.clientX - rect.left) * (canvas.width / rect.width)) /
        window.devicePixelRatio,
      y:
        ((e.clientY - rect.top) * (canvas.height / rect.height)) /
        window.devicePixelRatio,
    };
  };

  const startDrawing = (e) => {
    if (!user) return;

    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setLastPoint(point);

    if (currentTool === "pen" || currentTool === "highlighter") {
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalCompositeOperation =
        currentTool === "highlighter" ? "multiply" : "source-over";
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = currentTool === "highlighter" ? 0.5 : 1;

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }

    onInteraction?.();
  };

  const draw = (e) => {
    if (!isDrawing || !lastPoint || !user) return;

    const point = getCanvasPoint(e);
    const ctx = canvasRef.current.getContext("2d");

    switch (currentTool) {
      case "pen":
      case "highlighter":
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        break;

      case "eraser":
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(point.x, point.y, brushSize, 0, 2 * Math.PI);
        ctx.fill();
        break;

      default:
        break;
    }

    setLastPoint(point);
  };

  const stopDrawing = async (e) => {
    if (!isDrawing || !user) return;

    setIsDrawing(false);
    setLastPoint(null);

    // Save the drawing data
    const drawingData = {
      tool: currentTool,
      color: currentColor,
      size: brushSize,
      points: [], // In a real implementation, collect all points during drawing
      timestamp: new Date().toISOString(),
    };

    try {
      await saveDrawing(drawingData);
    } catch (error) {
      console.error("Failed to save drawing:", error);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    draw(e);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    stopDrawing(e);
  };

  const handleMouseLeave = (e) => {
    if (isDrawing) {
      stopDrawing(e);
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    draw(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing(e);
  };

  const getCursorStyle = () => {
    switch (currentTool) {
      case "pen":
        return "crosshair";
      case "highlighter":
        return "crosshair";
      case "eraser":
        return "grab";
      default:
        return "default";
    }
  };

  return (
    <canvas
      id="whiteboard-canvas"
      ref={canvasRef}
      className="w-full h-80 block"
      style={{ cursor: getCursorStyle() }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default Canvas;
