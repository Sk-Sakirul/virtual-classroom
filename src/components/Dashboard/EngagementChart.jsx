import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EngagementChart = ({ classroomId }) => {
  const { user } = useSelector((state) => state.auth);
  const [timeRange, setTimeRange] = useState("1hour");
  const [chartData, setChartData] = useState([]);

  // Mock chart data
  const mockChartData = [
    { time: "14:00", engagement: 75, activeUsers: 20 },
    { time: "14:05", engagement: 82, activeUsers: 22 },
    { time: "14:10", engagement: 78, activeUsers: 21 },
    { time: "14:15", engagement: 85, activeUsers: 24 },
    { time: "14:20", engagement: 90, activeUsers: 25 },
    { time: "14:25", engagement: 88, activeUsers: 24 },
    { time: "14:30", engagement: 92, activeUsers: 25 },
    { time: "14:35", engagement: 87, activeUsers: 23 },
    { time: "14:40", engagement: 85, activeUsers: 22 },
    { time: "14:45", engagement: 89, activeUsers: 24 },
    { time: "14:50", engagement: 93, activeUsers: 25 },
    { time: "14:55", engagement: 91, activeUsers: 24 },
  ];

  useEffect(() => {
    // In a real implementation, fetch data based on timeRange
    setChartData(mockChartData);
  }, [timeRange]);

  if (user?.role !== "teacher") {
    return null;
  }

  const maxEngagement = Math.max(...chartData.map((d) => d.engagement));
  const maxUsers = Math.max(...chartData.map((d) => d.activeUsers));

  return (
    <div className="bg-white/60 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Engagement Over Time
        </h4>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="1hour">Last Hour</option>
          <option value="1day">Last 24 Hours</option>
          <option value="1week">Last Week</option>
        </select>
      </div>

      {/* Chart Container */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-200 p-4">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-8">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Chart Area */}
        <div className="ml-8 h-full relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((line) => (
              <div
                key={line}
                className="absolute w-full border-t border-gray-200 border-dashed"
                style={{ top: `${100 - line}%` }}
              ></div>
            ))}
          </div>

          {/* Engagement Line */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient
                id="engagementGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(59, 130, 246)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(59, 130, 246)"
                  stopOpacity="0.1"
                />
              </linearGradient>
            </defs>

            {/* Area under the curve */}
            <path
              d={`M 0 ${100 - (chartData[0]?.engagement || 0)}${chartData
                .map(
                  (point, index) =>
                    ` L ${(index / (chartData.length - 1)) * 100} ${
                      100 - point.engagement
                    }`
                )
                .join("")} L 100 100 L 0 100 Z`}
              fill="url(#engagementGradient)"
              className="opacity-50"
            />

            {/* Line */}
            <path
              d={`M 0 ${100 - (chartData[0]?.engagement || 0)}${chartData
                .map(
                  (point, index) =>
                    ` L ${(index / (chartData.length - 1)) * 100} ${
                      100 - point.engagement
                    }`
                )
                .join("")}`}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              className="drop-shadow-sm"
            />

            {/* Data Points */}
            {chartData.map((point, index) => (
              <circle
                key={index}
                cx={`${(index / (chartData.length - 1)) * 100}%`}
                cy={`${100 - point.engagement}%`}
                r="3"
                fill="rgb(59, 130, 246)"
                className="drop-shadow-sm hover:r-4 transition-all cursor-pointer"
              >
                <title>{`${point.time}: ${point.engagement}% engagement, ${point.activeUsers} users`}</title>
              </circle>
            ))}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 mt-2">
          {chartData
            .filter((_, index) => index % 3 === 0)
            .map((point) => (
              <span key={point.time}>{point.time}</span>
            ))}
        </div>

        {/* Legend */}
        <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Engagement %</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active Users</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(
              chartData.reduce((sum, point) => sum + point.engagement, 0) /
                chartData.length
            )}
            %
          </p>
          <p className="text-xs text-gray-600">Avg Engagement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{maxUsers}</p>
          <p className="text-xs text-gray-600">Peak Users</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{maxEngagement}%</p>
          <p className="text-xs text-gray-600">Peak Engagement</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;
