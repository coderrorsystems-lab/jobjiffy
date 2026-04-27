export default function TabsNav({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
