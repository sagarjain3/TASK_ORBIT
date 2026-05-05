import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardMetrics, fetchProjectDashboardMetrics } from '../features/dashboard/dashboardSlice';
import { fetchProjects } from '../features/projects/projectSlice';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { CheckCircle, AlertCircle, LayoutList, TrendingUp } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Low, Medium, High Priority Colors
const STATUS_COLORS = ['#94a3b8', '#6366f1', '#10b981']; // To Do, In Progress, Done

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { metrics, loading } = useSelector((state) => state.dashboard);
  const { projects, selectedProjectId } = useSelector((state) => state.projects);

  // Fetch projects on mount if not loaded (so selectedProjectId gets auto-set)
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  // Fetch dashboard data whenever selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchProjectDashboardMetrics(selectedProjectId));
    } else if (projects.length === 0) {
      // Fallback: no projects at all, use global dashboard
      dispatch(fetchDashboardMetrics());
    }
  }, [dispatch, selectedProjectId, projects.length]);

  // Find the selected project name for display
  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  // Format data for Recharts
  const statusData = metrics ? [
    { name: 'To Do', count: metrics.statusStats?.todo || 0 },
    { name: 'In Progress', count: metrics.statusStats?.inprogress || 0 },
    { name: 'Done', count: metrics.statusStats?.done || 0 },
  ] : [];

  const priorityData = metrics ? [
    { name: 'Low', count: metrics.priorityStats?.low || 0 },
    { name: 'Medium', count: metrics.priorityStats?.medium || 0 },
    { name: 'High', count: metrics.priorityStats?.high || 0 },
  ] : [];

  const userData = metrics?.tasksPerUser?.map(u => ({
    name: u.name,
    Total: u.total,
    Completed: u.completed
  })) || [];

  if (loading && !metrics?.totalTasks) {
    return (
      <div className="flex flex-col h-full p-6 lg:p-8 bg-slate-50">
        <div className="w-64 h-8 skeleton rounded-lg mb-2"></div>
        <div className="w-48 h-4 skeleton rounded mb-8"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="h-32 skeleton rounded-2xl"></div>
          <div className="h-32 skeleton rounded-2xl delay-75"></div>
          <div className="h-32 skeleton rounded-2xl delay-150"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 skeleton rounded-2xl delay-200"></div>
          <div className="h-80 skeleton rounded-2xl delay-300"></div>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8 lg:p-12 bg-transparent text-slate-800 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Overview</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            {selectedProject ? selectedProject.name : 'Dashboard'}
            {metrics?.role && (
              <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                metrics.role === 'admin'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {metrics.role}
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {selectedProject
              ? `Real-time analytics for ${selectedProject.name}`
              : `${getGreeting()}, ${user?.name} 👋`
            }
          </p>
        </div>
        
        <div className="mt-6 md:mt-0 flex gap-3">
           {/* Add any global actions here if needed */}
        </div>
      </div>

      {/* Overall Progress Section */}
      {metrics?.totalTasks > 0 && (
        <div className="mb-10 glass-card p-8 rounded-[32px] animate-fade-in delay-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {metrics?.role === 'admin'
                    ? (selectedProject ? 'Project Completion' : 'Organization Progress')
                    : 'My Task Progress'
                  }
                </h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-indigo-600">
                  {metrics.projectProgress || 0}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Active</span>
              </div>
            </div>
            
            <div className="w-full h-4 bg-slate-100/50 rounded-full overflow-hidden p-1 border border-slate-200/50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-1000 ease-out rounded-full progress-bar-animated shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                style={{ width: `${metrics.projectProgress || 0}%` }}
              ></div>
            </div>
            
            <div className="mt-5 flex items-center justify-between text-sm">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-slate-500 font-semibold">{metrics.statusStats.done} Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span className="text-slate-400 font-semibold">{metrics.totalTasks - metrics.statusStats.done} Remaining</span>
                </div>
              </div>
              {metrics?.role !== 'admin' && (
                <span className="text-slate-400 font-medium italic">Personal stats</span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
        {[
          { 
            label: 'Total Tasks', 
            value: metrics?.totalTasks || 0, 
            icon: LayoutList, 
            color: 'indigo',
            delay: 'delay-100' 
          },
          { 
            label: 'Overdue', 
            value: metrics?.overdueTasks || 0, 
            icon: AlertCircle, 
            color: 'rose',
            delay: 'delay-200' 
          },
          { 
            label: 'Completed', 
            value: metrics?.statusStats?.done || 0, 
            icon: CheckCircle, 
            color: 'emerald',
            delay: 'delay-300' 
          }
        ].map((item, i) => (
          <div key={i} className={`group p-8 bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 metric-card animate-fade-in ${item.delay}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</h3>
                <p className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform origin-left duration-500">
                  {item.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                <item.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className={`w-full h-1.5 bg-${item.color}-50 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full bg-${item.color}-500 rounded-full`} 
                  style={{ width: `${item.value > 0 ? 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Status Bar Chart */}
        <div className="p-8 bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 animate-fade-in delay-400">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Distribution by Status</h3>
            <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-slate-300"></div>
               <div className="w-1 h-1 rounded-full bg-slate-300"></div>
               <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 12 }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }} 
                />
                <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="p-8 bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 animate-fade-in delay-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Priority Levels</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">Live View</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="45%"
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={8}
                  dataKey="count"
                  stroke="none"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle" 
                  iconSize={10} 
                  wrapperStyle={{ paddingTop: '30px', fontSize: '12px', fontWeight: 600, color: '#64748b' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Performance Chart — only visible for admin role */}
      {metrics?.role === 'admin' && userData.length > 0 && (
        <div className="p-8 bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 animate-fade-in delay-500">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Team Velocity</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Comparing total tasks vs completed per member</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
              </div>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 12 }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }} 
                />
                <Bar dataKey="Total" fill="#e2e8f0" radius={[10, 10, 10, 10]} barSize={32} />
                <Bar dataKey="Completed" fill="#4f46e5" radius={[10, 10, 10, 10]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
