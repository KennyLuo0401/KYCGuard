import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 bg-gray-800/30 backdrop-blur-sm p-2 rounded-xl border border-gray-700/30 shadow-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex-1 min-w-[140px] flex items-center justify-center gap-2 
            px-4 py-2.5 rounded-lg font-medium
            transition-all duration-300 relative
            ${activeTab === tab.id 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02] hover:bg-emerald-600' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }
            group
          `}
        >
          {/* Glow effect for active tab */}
          {activeTab === tab.id && (
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-lg -z-10"></div>
          )}

          {/* Icon with animation */}
          {tab.icon && (
            <span className={`
              w-5 h-5 transition-transform duration-300
              ${activeTab === tab.id 
                ? 'text-white scale-110' 
                : 'text-gray-400 group-hover:text-white group-hover:scale-110'
              }
            `}>
              {tab.icon}
            </span>
          )}

          {/* Label */}
          <span className={`
            transition-all duration-300
            ${activeTab === tab.id 
              ? 'transform translate-x-0' 
              : 'group-hover:translate-x-1'
            }
          `}>
            {tab.label}
          </span>

          {/* Active indicator dot */}
          {activeTab === tab.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
          )}
        </button>
      ))}
    </div>
  );
}