import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import {
  exportGoalAchievementReport,
} from "../utils/pdfExport";

import {
  useEffect,
  useState,
} from "react";

import CountUp from "react-countup";

import { toast } from "react-hot-toast";

import axios from "axios";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F97316",
];

const Analytics = () => {

  const [goals, setGoals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "https://goalportal-api.onrender.com/api/goals"
      );

      setGoals(res.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  const completed =
    goals.filter(
      (g) => g.progress === 100
    ).length;

  const pending =
    goals.filter(
      (g) => g.progress < 100
    ).length;

  const completionRate =
    goals.length === 0
      ? 0
      : Math.round(
          (completed /
            goals.length) *
            100
        );

  const analyticsData = [
    {
      name: "Completed",
      value: completed,
    },

    {
      name: "Pending",
      value: pending,
    },
  ];

  const progressData = goals.map(
    (goal) => ({
      name: goal.title,
      progress:
        goal.progress || 0,
    })
  );

  const productivityData = [
    {
      month: "Jan",
      productivity: 62,
    },

    {
      month: "Feb",
      productivity: 71,
    },

    {
      month: "Mar",
      productivity: 78,
    },

    {
      month: "Apr",
      productivity: 85,
    },

    {
      month: "May",
      productivity: 91,
    },
  ];

  if (loading) {

    return (

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {[1, 2, 3, 4].map((item) => (

          <div
            key={item}
            className="h-40 rounded-3xl bg-white/10 animate-pulse"
          />

        ))}

      </div>

    );

  }

  return (

    <div className="text-white fade-in">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

        <div>

          <h1 className="text-5xl font-bold text-blue-400">
            Analytics Dashboard 📊
          </h1>

          <p className="text-gray-300 mt-3">
            Enterprise AI-powered employee analytics and performance insights.
          </p>

        </div>

        <button
          onClick={() => {

            exportGoalAchievementReport(goals);

            toast.success(
              "Analytics PDF Exported 🚀"
            );

          }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
        >

          Export PDF Report

        </button>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Total Goals
          </p>

          <h2 className="text-5xl font-bold mt-3">

            <CountUp
              end={goals.length}
              duration={2}
            />

          </h2>

        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Completed Goals
          </p>

          <h2 className="text-5xl font-bold mt-3">

            <CountUp
              end={completed}
              duration={2}
            />

          </h2>

        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Pending Goals
          </p>

          <h2 className="text-5xl font-bold mt-3">

            <CountUp
              end={pending}
              duration={2}
            />

          </h2>

        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Completion Rate
          </p>

          <h2 className="text-5xl font-bold mt-3">

            <CountUp
              end={completionRate}
              duration={2}
            />

            %

          </h2>

        </div>

      </div>

      {/* AI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4">
            AI Insights 🤖
          </h2>

          <div className="space-y-3 text-sm">

            <p>
              • Productivity increased by 18%
            </p>

            <p>
              • 3 employees exceeded KPI targets
            </p>

            <p>
              • AI detected high performance consistency
            </p>

            <p>
              • Weekly goal completion improving
            </p>

          </div>

        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4">
            Escalation Alerts 🚨
          </h2>

          <div className="space-y-3 text-sm">

            <p>
              • 2 overdue high-priority goals
            </p>

            <p>
              • HR escalation triggered
            </p>

            <p>
              • Reminder notifications delivered
            </p>

            <p>
              • Risk detection active
            </p>

          </div>

        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4">
            Teams Activity 💬
          </h2>

          <div className="space-y-3 text-sm">

            <p>
              • Goal approved by manager
            </p>

            <p>
              • Weekly reports exported
            </p>

            <p>
              • Performance review submitted
            </p>

            <p>
              • Teams integration active
            </p>

          </div>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* PIE CHART */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl hover:scale-[1.02] transition duration-300">

          <h2 className="text-3xl font-bold mb-8">
            Goal Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={analyticsData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >

                {analyticsData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* BAR CHART */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl hover:scale-[1.02] transition duration-300">

          <h2 className="text-3xl font-bold mb-8">
            Goal Progress
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={progressData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
              />

              <XAxis
                dataKey="name"
                stroke="#D1D5DB"
              />

              <YAxis
                stroke="#D1D5DB"
              />

              <Tooltip />

              <Bar
                dataKey="progress"
                fill="#3B82F6"
                radius={[
                  10,
                  10,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* PRODUCTIVITY TREND */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl mt-10">

        <h2 className="text-3xl font-bold mb-8">
          Productivity Trend 📈
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <AreaChart
            data={productivityData}
          >

            <defs>

              <linearGradient
                id="colorUv"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis
              dataKey="month"
              stroke="#D1D5DB"
            />

            <YAxis
              stroke="#D1D5DB"
            />

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="productivity"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorUv)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default Analytics;