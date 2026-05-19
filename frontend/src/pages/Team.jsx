import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Team = () => {
  const [employees, setEmployees] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  const [newEmployee, setNewEmployee] =
    useState({
      name: "",
      role: "",
    });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:5000/api/employees"
          );

        setEmployees(res.data);
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to fetch employees"
        );
      }
    };

  const addEmployee =
    async () => {
      try {
        const res =
          await axios.post(
            "http://localhost:5000/api/employees",
            {
              name: newEmployee.name,
              role: newEmployee.role,
              progress: 0,
              status: "Active",
            }
          );

        setEmployees([
          ...employees,
          res.data,
        ]);

        toast.success(
          "Employee added successfully 🚀"
        );

        setShowModal(false);

        setNewEmployee({
          name: "",
          role: "",
        });
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to add employee"
        );
      }
    };

  const deleteEmployee =
    async (id) => {
      try {
        await axios.delete(
          `http://localhost:5000/api/employees/${id}`
        );

        setEmployees(
          employees.filter(
            (employee) =>
              employee._id !==
              id
          )
        );

        toast.success(
          "Employee deleted"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div
      className={`min-h-screen p-6 md:p-10 transition-all duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">

        <div>
          <h1
            className={`text-5xl font-bold ${
              darkMode
                ? "text-white"
                : "text-black"
            }`}
          >
            Team Management 👥
          </h1>

          <p
            className={`mt-3 ${
              darkMode
                ? "text-gray-300"
                : "text-gray-500"
            }`}
          >
            Manage employees and
            track performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="bg-yellow-400 hover:bg-yellow-300 transition duration-300 text-black px-6 py-3 rounded-2xl font-semibold shadow-xl"
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white px-6 py-3 rounded-2xl shadow-xl"
          >
            + Add Employee
          </button>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Total Employees
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {employees.length}
          </h2>

        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Active Employees
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {
              employees.filter(
                (e) =>
                  e.status ===
                  "Active"
              ).length
            }
          </h2>

        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">

          <p className="text-white/80">
            Average Performance
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {employees.length === 0
              ? 0
              : Math.round(
                  employees.reduce(
                    (
                      acc,
                      employee
                    ) =>
                      acc +
                      employee.progress,
                    0
                  ) /
                    employees.length
                )}
            %
          </h2>

        </div>

      </div>

      {/* EMPTY STATE */}
      {employees.length === 0 ? (

        <div className="text-center py-24">

          <h2 className="text-4xl font-bold text-gray-300">
            No Employees Yet 🚀
          </h2>

          <p className="mt-4 text-gray-400">
            Start by adding your
            first employee.
          </p>

        </div>

      ) : (

        /* EMPLOYEE CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {employees.map(
            (employee) => (

              <div
                key={
                  employee._id
                }
                className={`rounded-3xl shadow-2xl p-8 backdrop-blur-lg border border-white/10 transition duration-300 hover:scale-[1.03] hover:-translate-y-1 ${
                  darkMode
                    ? "bg-white/10"
                    : "bg-white"
                }`}
              >

                {/* TOP */}
                <div className="flex items-center gap-5 mb-8">

                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl">

                    {employee.name[0]}

                  </div>

                  <div>

                    <h2
                      className={`text-3xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {employee.name}
                    </h2>

                    <p
                      className={`mt-1 ${
                        darkMode
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {employee.role}
                    </p>

                  </div>

                </div>

                {/* PROGRESS */}
                <div className="mb-8">

                  <div className="flex justify-between mb-3">

                    <p className="font-semibold">
                      Performance
                    </p>

                    <p className="font-bold">
                      {
                        employee.progress
                      }
                      %
                    </p>

                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-4">

                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${employee.progress}%`,
                      }}
                    ></div>

                  </div>

                </div>

                {/* STATUS */}
                <div className="flex justify-between items-center">

                  <span className="px-5 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-300">

                    {
                      employee.status
                    }

                  </span>

                  <button
                    onClick={() =>
                      deleteEmployee(
                        employee._id
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 transition duration-300 text-white px-6 py-3 rounded-2xl shadow-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div
            className={`p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-white/10 ${
              darkMode
                ? "bg-gray-900 text-white"
                : "bg-white text-black"
            }`}
          >

            <h2 className="text-4xl font-bold mb-8">
              Add Employee 👨‍💻
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Employee Name"
                value={
                  newEmployee.name
                }
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    name:
                      e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl outline-none text-white"
              />

              <input
                type="text"
                placeholder="Role"
                value={
                  newEmployee.role
                }
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    role:
                      e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl outline-none text-white"
              />

              <div className="flex gap-4 pt-4">

                <button
                  onClick={
                    addEmployee
                  }
                  className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white px-6 py-4 rounded-2xl w-full"
                >
                  Add Employee
                </button>

                <button
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="bg-gray-700 hover:bg-gray-600 transition duration-300 text-white px-6 py-4 rounded-2xl w-full"
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
};

export default Team;