import GoalSearchFilter from "./components/GoalSearchFilter";
import Settings from "./pages/Settings";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EscalationDashboard from "./pages/EscalationDashboard";
import EmailNotificationCenter from "./pages/EmailNotificationCenter";
import MicrosoftLoginButton from "./components/MicrosoftLoginButton";
import { useMicrosoftAuth } from "./contexts/MicrosoftAuthContext";
import {
  useEffect,
  useState,
} from "react";
import axios from "axios";

import MainLayout from "./layout/MainLayout";

import Analytics from "./pages/Analytics";
import Team from "./pages/Team";

function App() {
  const [darkMode, setDarkMode] =
    useState(true);

  const [user, setUser] =
    useState(null);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [goals, setGoals] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const {
    user: microsoftUser,
  } = useMicrosoftAuth();

  const [goalForm, setGoalForm] =
    useState({
      title: "",
      assignedTo: "",
      priority: "medium",
      deadline: "",
      weightage: 10,
    });

  // ================= FETCH GOALS =================
  const fetchGoals = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/goals"
      );

      setGoals(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ================= LOGIN =================
  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      setUser(res.data.user);

      alert("Login Successful 🚀");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  // ================= LOGOUT =================
  const logoutUser = () => {

    setUser(null);

    localStorage.clear();

    setEmail("");

    setPassword("");

    window.location.href = "/";
  };

  // ================= ADD GOAL =================
  const addGoal = async () => {
    try {

      const totalWeightage =
        goals.reduce(
          (acc, goal) =>
            acc + goal.weightage,
          0
        );

      if (
        totalWeightage +
        Number(
          goalForm.weightage
        ) >
        100
      ) {

        alert(
          "Total weightage cannot exceed 100%"
        );

        return;
      }

      const newGoal = {
        title: goalForm.title,

        weightage: Number(
          goalForm.weightage
        ),

        status: "pending",

        progress: 0,

        assignedTo:
          goalForm.assignedTo,

        assignedBy: activeUser.name,

        priority:
          goalForm.priority,

        deadline:
          goalForm.deadline,
      };

      const res = await axios.post(
        "http://localhost:5000/api/goals",
        newGoal
      );

      setGoals([
        ...goals,
        res.data,
      ]);

      setShowModal(false);

      setGoalForm({
        title: "",
        assignedTo: "",
        priority: "medium",
        deadline: "",
        weightage: 10,
      });

      alert(
        "Goal Added Successfully 🚀"
      );

    } catch (error) {

      console.log(error);

      alert("Failed to add goal");
    }
  };

  // ================= UPDATE PROGRESS =================
  const updateProgress = async (
    id,
    progress
  ) => {

    try {

      let status = "pending";

      if (progress >= 80) {
        status = "completed";
      } else if (
        progress >= 40
      ) {
        status = "on_track";
      }

      const res = await axios.put(
        `http://localhost:5000/api/goals/${id}`,
        {
          progress,
          status,
        }
      );

      setGoals(
        goals.map((goal) =>
          goal._id === id
            ? res.data
            : goal
        )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to update progress"
      );
    }
  };

  // ================= DELETE GOAL =================
  const deleteGoal = async (
    id
  ) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/goals/${id}`
      );

      fetchGoals();

      alert("Goal Deleted");

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
    }
  };

  // ================= LOGIN PAGE =================
  const activeUser =
    user || microsoftUser;
  if (!activeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">

          <h1 className="text-5xl font-bold text-center text-blue-500 mb-10">
            Goal Portal 🚀
          </h1>

          <div className="space-y-5">

            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-gray-400 p-4 rounded-xl outline-none focus:border-blue-500"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Enter password"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-gray-400 p-4 rounded-xl outline-none focus:border-blue-500"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              onClick={loginUser}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-all duration-300 text-white py-4 rounded-2xl shadow-2xl font-semibold"
            >
              Login
            </button>

            <div className="relative py-2">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-slate-900 px-4 text-sm text-slate-400">
                  OR CONTINUE WITH
                </span>
              </div>

            </div>

            <MicrosoftLoginButton />

            <div className="space-y-3 pt-6">

              <button
                onClick={() => {
                  setEmail(
                    "employee@demo.com"
                  );

                  setPassword(
                    "password123"
                  );
                }}
                className="w-full border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-300 py-3 rounded-xl"
              >
                Demo Employee
              </button>

              <button
                onClick={() => {
                  setEmail(
                    "manager@demo.com"
                  );

                  setPassword(
                    "password123"
                  );
                }}
                className="w-full border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-300 py-3 rounded-xl"
              >
                Demo Manager
              </button>

              <button
                onClick={() => {
                  setEmail(
                    "admin@demo.com"
                  );

                  setPassword(
                    "password123"
                  );
                }}
                className="w-full border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-300 py-3 rounded-xl"
              >
                Demo Admin
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }
  // ================= FILTERED GOALS =================

  const filteredGoals = goals.filter(
    (goal) => {

      const matchesSearch =
        goal.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "all"
          ? true
          : goal.status ===
          statusFilter;

      const matchesPriority =
        priorityFilter ===
          "all"
          ? true
          : goal.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    }
  );
  // ================= DASHBOARD =================
  const DashboardPage = () => (
    <div className="fade-in">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-10">

        <div>

          <h1 className="text-5xl font-bold text-blue-400">
            Dashboard 🚀
          </h1>

          <p className="mt-3 text-gray-300">
            Welcome {activeUser.name}
          </p>

          <p className="text-sm text-gray-400">
            Role: {activeUser.role}
          </p>

        </div>

        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 text-white px-6 py-3 rounded-2xl shadow-xl"
        >
          Logout
        </button>

      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300 text-white">

          <h2 className="text-3xl font-bold mb-3">
            Goals
          </h2>

          <p>
            Create and manage
            performance goals.
          </p>

        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300 text-white">

          <h2 className="text-3xl font-bold mb-3">
            Check-ins
          </h2>

          <p>
            Quarterly progress
            tracking system.
          </p>

        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300 text-white">

          <h2 className="text-3xl font-bold mb-3">
            Analytics
          </h2>

          <p>
            Performance reports
            and insights.
          </p>

        </div>

      </div>
      <GoalSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      {/* ENTERPRISE INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4">
            AI Insights 🤖
          </h2>

          <div className="space-y-3 text-sm">

            <p>
              • Team productivity increased by 18%
            </p>

            <p>
              • 3 high-priority goals need attention
            </p>

            <p>
              • Escalation risk detected
            </p>

            <p>
              • AI detected improved employee consistency
            </p>

          </div>

        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4">
            Escalation Alerts 🚨
          </h2>

          <div className="space-y-3 text-sm">

            <p>
              • 2 overdue enterprise goals
            </p>

            <p>
              • HR escalation triggered
            </p>

            <p>
              • Manager review pending
            </p>

            <p>
              • Auto-reminders delivered
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
              • Weekly report exported
            </p>

            <p>
              • New performance review submitted
            </p>

            <p>
              • Teams notification delivered
            </p>

          </div>

        </div>

      </div>
      {/* GOALS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-4xl font-bold text-white">
            Goals
          </h2>

          {activeUser.role !==
            "employee" && (
              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white px-5 py-3 rounded-2xl shadow-xl"
              >
                + Add Goal
              </button>
            )}

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-white">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-4">
                  Goal
                </th>

                <th className="p-4">
                  Assigned To
                </th>

                <th className="p-4">
                  Priority
                </th>

                <th className="p-4">
                  Deadline
                </th>

                <th className="p-4">
                  Progress
                </th>

                <th className="p-4">
                  Status
                </th>

                {activeUser.role !==
                  "employee" && (
                    <th className="p-4">
                      Action
                    </th>
                  )}

              </tr>

            </thead>

            <tbody>

              {goals.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-20 text-gray-400"
                  >

                    <h2 className="text-4xl font-bold mb-3">
                      No Goals Yet 🚀
                    </h2>

                    <p>
                      Start by creating
                      your first goal.
                    </p>

                    <p className="mt-4 text-blue-400">
                      AI recommends creating quarterly performance goals.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredGoals.map(
                  (
                    goal,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition duration-300"
                    >

                      <td className="p-4">
                        {
                          goal.title
                        }
                      </td>

                      <td className="p-4">
                        {
                          goal.assignedTo
                        }
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${goal.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : goal.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                            }`}
                        >

                          {goal.priority}

                        </span>

                      </td>

                      <td className="p-4">
                        {
                          goal.deadline
                        }
                      </td>

                      <td className="p-4 min-w-[220px]">

                        <div className="w-full bg-gray-700 rounded-full h-3 mb-3">

                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${goal.progress}%`,
                            }}
                          ></div>

                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={
                            goal.progress
                          }
                          className="w-full"
                          onChange={(e) =>
                            updateProgress(
                              goal._id,
                              Number(
                                e.target
                                  .value
                              )
                            )
                          }
                        />

                        <p className="text-sm mt-2">
                          {
                            goal.progress
                          }
                          %
                        </p>

                      </td>

                      <td className="p-4">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${goal.status === "completed"
                            ? "bg-blue-500/20 text-blue-400"
                            : goal.status === "on_track"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-orange-500/20 text-orange-400"
                            }`}
                        >

                          {goal.status}

                        </span>

                      </td>

                      {activeUser.role !==
                        "employee" && (
                          <td className="p-4">

                            <button
                              onClick={() =>
                                deleteGoal(
                                  goal._id
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 hover:scale-105 transition duration-300 text-white px-4 py-2 rounded-xl"
                            >
                              Delete
                            </button>

                          </td>
                        )}

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl text-white">

            <h2 className="text-3xl font-bold mb-8">
              Create Goal 🚀
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Goal Title"
                value={
                  goalForm.title
                }
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    title:
                      e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none"
              />

              <input
                type="text"
                placeholder="Assign To"
                value={
                  goalForm.assignedTo
                }
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    assignedTo:
                      e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none"
              />

              <select
                value={
                  goalForm.priority
                }
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    priority:
                      e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none"
              >

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

              <input
                type="date"
                value={
                  goalForm.deadline
                }
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    deadline:
                      e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none"
              />

              <input
                type="number"
                placeholder="Weightage"
                value={
                  goalForm.weightage
                }
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    weightage:
                      e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none"
              />

              <div className="flex gap-4 pt-4">

                <button
                  onClick={addGoal}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition duration-300 py-4 rounded-2xl"
                >
                  Create Goal
                </button>

                <button
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="flex-1 bg-gray-700 hover:bg-gray-600 transition duration-300 py-4 rounded-2xl"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );

// ================= ROUTES =================
return (

  <>


    <MainLayout
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    >

      <Routes>

        <Route
          path="/"
          element={<DashboardPage />}
        />

        <Route
          path="/employee/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/manager/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/admin/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/team"
          element={<Team />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/notifications"
          element={
            <EmailNotificationCenter />
          }
        />

        <Route
          path="/escalations"
          element={
            <EscalationDashboard />
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </MainLayout>

  </>

);
}

export default App;