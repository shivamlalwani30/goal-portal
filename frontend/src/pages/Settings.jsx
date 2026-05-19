const Settings = () => {
  return (
    <div className="text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Settings ⚙️
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">

          <h2 className="text-2xl font-bold mb-4">
            Profile Settings
          </h2>

          <p className="text-gray-300">
            Manage employee profile information and preferences.
          </p>

        </div>

        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">

          <h2 className="text-2xl font-bold mb-4">
            Notifications
          </h2>

          <p className="text-gray-300">
            Configure AI alerts and escalation notifications.
          </p>

        </div>

        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">

          <h2 className="text-2xl font-bold mb-4">
            Security
          </h2>

          <p className="text-gray-300">
            Enterprise-grade authentication and access control.
          </p>

        </div>

        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">

          <h2 className="text-2xl font-bold mb-4">
            Integrations
          </h2>

          <p className="text-gray-300">
            Microsoft Teams and analytics integrations enabled.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Settings;