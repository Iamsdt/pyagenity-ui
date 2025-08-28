const DashboardUI = () => {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome to your application
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Widget 1: Active Users */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
            <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
              Active Users
            </span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              12
            </span>
          </div>
          {/* Widget 2: Profile */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
            <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
              Profile
            </span>
            <span className="text-slate-800 dark:text-slate-100 font-medium">
              User
            </span>
          </div>
          {/* Widget 3: Status */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
            <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
              Status
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardUI
