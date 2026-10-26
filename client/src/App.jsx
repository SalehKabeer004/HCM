import { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import AttendanceHistory from './pages/AttendanceHistory';
import Leaves from './pages/Leaves';
import OrgSettings from './pages/OrgSettings';

import {
  LayoutDashboard,
  Users,
  MapPin,
  History,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Mail,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  ArrowUpRight,
  Sparkles,
  Building2,
  Check,
  Copy
} from 'lucide-react';

// Protected Route Component with Role Check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-600 border border-blue-400/30"></span>
        </div>
        <p className="text-sm font-medium tracking-wide text-slate-400">Loading HCM Lite...</p>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Sleek Sticky Top Navbar with Brand, Highlighting, Capsule, and Mobile Drawer
function Navbar() {
  const { user, logout, token } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (location.pathname === '/login') return null;

  const isActive = (path) => location.pathname === path;
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userRole = user?.role || 'Employee';
  const isAdminOrHR = userRole === 'Admin' || userRole === 'HR';

  // Role Badge Styling
  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 ring-1 ring-indigo-500/20';
      case 'hr':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30 ring-1 ring-amber-500/20';
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30 ring-1 ring-blue-500/20';
    }
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdminOrHR ? [{ to: '/employees', label: 'Employees', icon: Users }] : []),
    { to: '/attendance', label: 'Check-In', icon: MapPin },
    { to: '/attendance-history', label: 'History', icon: History },
    { to: '/leaves', label: 'Leaves', icon: CalendarDays },
    ...(isAdminOrHR ? [{ to: '/settings', label: 'Settings', icon: Settings }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-slate-100 tracking-tight">HCM</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Lite</span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wider uppercase">
                    Enterprise
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-1 hidden sm:block">
                  Workforce Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                      active
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: User Profile Capsule & Logout */}
          <div className="hidden md:flex items-center gap-3">
            {/* User Capsule */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
              {/* Avatar circle */}
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                {userName.charAt(0)}
              </div>
              
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 capitalize truncate max-w-[120px] leading-tight">
                  {userName}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-medium">Online</span>
                </div>
              </div>

              {/* Role Badge */}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getRoleBadgeStyle(userRole)}`}>
                {userRole}
              </span>
            </div>

            {/* Logout Action */}
            {token && (
              <button
                onClick={logout}
                title="Sign out of account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          {/* User profile capsule in mobile view */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 capitalize">{userName}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getRoleBadgeStyle(userRole)}`}>
              {userRole}
            </span>
          </div>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {token && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

// Hyper-Modern Dashboard Component
function Dashboard() {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userRole = user?.role || 'Employee';
  const userEmail = user?.email || 'user@company.corp';

  // Format current date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setLeaves(res.data);
        }
      } catch {
        // Fallback or empty
      } finally {
        setLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(userEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter leaves
  const filteredLeaves = leaves.filter((item) => {
    const matchesSearch =
      item.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Hero Section with Gradient Text & Quick Context */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Ambient background decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-blue-400"></span>
              <span>Enterprise Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent capitalize">
                {userName}
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Real-time enterprise overview of your workforce, daily geolocation check-ins, leave requests, and department operational policies.
            </p>
          </div>

          {/* Quick Action Pill Buttons in Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/attendance"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <MapPin className="w-4 h-4" />
              <span>Record Attendance</span>
            </Link>

            <Link
              to="/leaves"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-750 text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-600"
            >
              <CalendarDays className="w-4 h-4 text-blue-400" />
              <span>Apply Leave</span>
            </Link>
          </div>
        </div>

        {/* Quick Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          
          {/* Card 1: User Role */}
          <div className="group relative rounded-2xl bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-blue-500/30 p-5 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Role</span>
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-100 uppercase tracking-tight">{userRole}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {userRole === 'Admin' ? 'Full system administrator rights' : userRole === 'HR' ? 'People & department management' : 'Standard employee workspace'}
            </p>
          </div>

          {/* Card 2: Email */}
          <div className="group relative rounded-2xl bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-indigo-500/30 p-5 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Email</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-semibold text-slate-200 truncate" title={userEmail}>
                {userEmail}
              </span>
              <button
                onClick={handleCopyEmail}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Copy email"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {copied ? 'Copied to clipboard!' : 'Single sign-on enterprise ID'}
            </p>
          </div>

          {/* Card 3: System Status with Pulse Indicator */}
          <div className="group relative rounded-2xl bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-emerald-500/30 p-5 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Status</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              </span>
              <span className="text-xl font-bold text-emerald-400 tracking-tight">Active</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              99.98% SLA • All services online
            </p>
          </div>

          {/* Card 4: Daily Shift & Geofence Check */}
          <div className="group relative rounded-2xl bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-blue-500/30 p-5 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workshift</span>
              <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-100 tracking-tight">09:00 AM</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                On Schedule
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              15 min grace period configured
            </p>
          </div>

        </div>
      </section>

      {/* Feature Quick Launch Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tile 1 */}
        <Link
          to="/attendance"
          className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 p-6 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              Geolocation Attendance
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify real-time coordinates against authorized office radiuses for tamper-proof attendance punches.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Punch in / out</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Tile 2 */}
        <Link
          to="/leaves"
          className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 p-6 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              Leave & Absence Hub
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit casual, sick, or annual leave requests and track manager approvals with live audit status.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Manage requests</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Tile 3 */}
        <Link
          to={userRole === 'Admin' || userRole === 'HR' ? '/employees' : '/attendance-history'}
          className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 p-6 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
              {userRole === 'Admin' || userRole === 'HR' ? <Users className="w-5 h-5" /> : <History className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
              {userRole === 'Admin' || userRole === 'HR' ? 'Employee Directory' : 'Attendance History'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {userRole === 'Admin' || userRole === 'HR'
                ? 'Manage organizational hierarchy, roles, compensation, and staff profiles.'
                : 'Inspect personal punch timestamps, late markers, and location verification logs.'}
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-sky-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>{userRole === 'Admin' || userRole === 'HR' ? 'View Directory' : 'View History'}</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

      </section>

      {/* Responsive Table Section: Live Leave Requests & Status Badges */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-5">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Recent Leave Requests</h2>
            <p className="text-xs text-slate-400 mt-1">Live status updates, approvals, and balance logs.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box with focus ring */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all w-48 sm:w-60"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                    statusFilter === filter
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Date Range</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loadingData ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarDays className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-medium text-slate-400">No requests match your criteria</p>
                      <p className="text-xs text-slate-400">Submit a new request or change filter settings.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaves.slice(0, 5).map((leave) => {
                  const status = leave.status || 'Pending';
                  return (
                    <tr
                      key={leave._id}
                      className="hover:bg-slate-800/40 transition-colors duration-150"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-[11px] font-bold text-slate-200 uppercase">
                            {leave.employee?.name ? leave.employee.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 capitalize">
                              {leave.employee?.name || 'Employee'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {leave.employee?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-300">
                        {leave.leaveType}
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {leave.startDate} → {leave.endDate}
                      </td>

                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </td>

                      <td className="py-3 px-4">
                        {status === 'Approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ring-1 ring-emerald-500/10">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 ring-1 ring-amber-500/10">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 ring-1 ring-rose-500/10">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info link */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <span>Showing latest leave requests</span>
          <Link
            to="/leaves"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
          >
            <span>View all in Leave Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

    </div>
  );
}

// Layout Wrapper with Dark Palette
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1 pb-12">{children}</main>
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-400">
        <p>© 2026 HCM Lite Enterprise • Human Capital & Workforce Management</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['Admin', 'HR']}>
                <OrgSettings />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Employees />
              </ProtectedRoute>
            } />

            <Route path="/attendance" element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="/attendance-history" element={
              <ProtectedRoute>
                <AttendanceHistory />
              </ProtectedRoute>
            } />
            <Route path="/leaves" element={
              <ProtectedRoute>
                <Leaves />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}
