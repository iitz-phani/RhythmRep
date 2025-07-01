import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface ProgressChartsProps {
  volumeData: Array<{ date: string; volume: number }>;
  weightData: Array<{ date: string; weight: number }>;
}

export function ProgressCharts({ volumeData, weightData }: ProgressChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Volume Progress Chart */}
      <div className="fitness-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-xl">Training Volume</h3>
          <div className="flex space-x-2">
            <button className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-lg">
              Weekly
            </button>
            <button className="text-sm text-gray-400 hover:text-white px-3 py-1">
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="volume" fill="url(#volumeGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#4ECDC4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Body Weight Tracking */}
      <div className="fitness-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-xl">Body Weight</h3>
          <button className="text-sm bg-secondary/20 text-secondary px-3 py-1 rounded-lg hover:bg-secondary hover:text-white transition-colors">
            Add Entry
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#4ECDC4"
                strokeWidth={3}
                dot={{ fill: "#4ECDC4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#4ECDC4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-center">
            <div className="text-lg font-bold">
              {weightData.length > 0 ? weightData[weightData.length - 1].weight : "---"}
            </div>
            <div className="text-xs text-gray-400">Current (lbs)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              {weightData.length > 1 
                ? (weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)
                : "---"}
            </div>
            <div className="text-xs text-gray-400">Change (lbs)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">170</div>
            <div className="text-xs text-gray-400">Goal (lbs)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
