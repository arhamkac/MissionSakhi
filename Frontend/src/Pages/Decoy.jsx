import React from 'react';
import { CheckCircle2, Circle, Plus, Calendar, Settings, User, Search, MoreVertical, LayoutGrid, Clock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { usePanic } from './PanicContext';

const Decoy = () => {
  const { user } = useAuth();
  const userName = user?.username || "Guest";
  const { togglePanic } = usePanic();

  const TASKS = [
    { id: 1, text: "Drink 2L of water throughout the day", completed: true, priority: "High" },
    { id: 2, text: "Prepare a healthy, balanced lunch", completed: false, priority: "Medium" },
    { id: 3, text: "Complete 15-minute mindfulness meditation", completed: false, priority: "Low" },
    { id: 4, text: "Evening walk (20+ minutes)", completed: true, priority: "Low" },
    { id: 5, text: "Read 10 pages of a calming book", completed: false, priority: "High" },
    { id: 6, text: "Digital detox (No screens after 9 PM)", completed: false, priority: "Medium" },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-slate-700 overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Panic Switch (Subtle Switch Dot) */}
      <button 
        onClick={togglePanic}
        className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-300/40 hover:bg-slate-400/60 transition-all cursor-default z-[100]"
        title="Quick Access"
      />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="font-semibold text-lg tracking-tight">PlanIt Pro</span>
        </div>

        <nav className="space-y-1 mb-auto">
          <NavItem icon={<Calendar size={18} />} label="Daily Planner" active />
          <NavItem icon={<Clock size={18} />} label="Upcoming" />
          <NavItem icon={<LayoutGrid size={18} />} label="Board View" />
          <NavItem icon={<CheckCircle2 size={18} />} label="Completed" />
        </nav>

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-4 px-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Productivity Scale</p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[65%]" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 italic">Consistent focus • 65%</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">Personal Workspace</p>
            </div>
            <Settings size={16} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10">
          <h1 className="text-xl font-semibold">Today's Focus</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 rounded-full text-sm border-0 focus:ring-1 focus:ring-blue-500 w-48 transition-all focus:w-64"
                readOnly
              />
            </div>
            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-slate-400 font-medium">Tuesday, April 14, 2026</p>
              <p className="text-2xl font-bold">Good morning, {userName}.</p>
            </div>
            <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm">
              <Plus size={18} />
              Add Task
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current List (Personal)</span>
              <button className="p-1 hover:bg-white rounded"><MoreVertical size={16} /></button>
            </div>
            <div className="divide-y divide-slate-100">
              {TASKS.map(task => (
                <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                  {task.completed ? (
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${task.completed ? 'text-slate-400 line-through' : 'font-medium'}`}>
                    {task.text}
                  </span>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                    task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100/50 border-dashed text-center">
            <p className="text-sm text-blue-600 font-medium">You've completed 2 out of 6 tasks today. Keep it up!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-slate-50 text-slate-500'
  }`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default Decoy;
