import Sidebar from "../components/Sidebar";

function MainLayout({
  children,
  darkMode,
  setDarkMode,
}) {
  return (
    <div
      className={`flex min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <Sidebar darkMode={darkMode} />

      <div className="flex-1 p-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className={`px-5 py-2 rounded-xl font-semibold shadow ${
              darkMode
                ? "bg-yellow-400 text-black"
                : "bg-slate-900 text-white"
            }`}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default MainLayout;