import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Settings,
  Clock,
  MapPin,
  Building,
  Plus,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers
} from 'lucide-react';

export default function OrgSettings() {
  const [settings, setSettings] = useState({
    officeStartTime: '09:00',
    gracePeriodMinutes: 15,
    allowedRadiusMeters: 150
  });
  
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingDept, setSavingDept] = useState(false);

  async function fetchOrgData() {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [settingsRes, deptRes] = await Promise.all([
        axios.get('http://localhost:5000/api/org/settings', config),
        axios.get('http://localhost:5000/api/org/departments', config)
      ]);

      if (settingsRes.data) {
        setSettings(settingsRes.data);
      }
      setDepartments(deptRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch organization data.');
    }
  }

  useEffect(() => {
    fetchOrgData();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/org/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Office rules & timings updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    setSavingDept(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/org/departments', {
        name: newDeptName,
        description: newDeptDesc
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewDeptName('');
      setNewDeptDesc('');
      setMessage('Department created successfully!');
      fetchOrgData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create department.');
    } finally {
      setSavingDept(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Enterprise Administration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Organization & Policy Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure office timing windows, GPS geofence threshold radiuses, and organizational departments.
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Shift & Office Rules */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Workshift & Geofence Rules</h2>
              <p className="text-xs text-slate-400">Punctuality parameters & perimeter bounds</p>
            </div>
          </div>

          <form onSubmit={handleUpdateSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Official Office Start Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={settings.officeStartTime} 
                  onChange={(e) => setSettings({ ...settings, officeStartTime: e.target.value })}
                  placeholder="09:00"
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">24-hour format (e.g. 09:00 or 10:30)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Grace Period (Minutes)
              </label>
              <input 
                type="number" 
                value={settings.gracePeriodMinutes} 
                onChange={(e) => setSettings({ ...settings, gracePeriodMinutes: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Allowable check-in buffer before marked late</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Allowed Radius (Meters)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number" 
                  value={settings.allowedRadiusMeters} 
                  onChange={(e) => setSettings({ ...settings, allowedRadiusMeters: Number(e.target.value) })}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Maximum distance permitted from registered office GPS</p>
            </div>

            <button 
              type="submit" 
              disabled={savingSettings}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {savingSettings ? 'Saving Policy...' : 'Save Office Rules'}
            </button>
          </form>
        </div>

        {/* Card 2: Department Management */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Department Structure</h2>
              <p className="text-xs text-slate-400">Add and manage corporate business units</p>
            </div>
          </div>

          {/* Add Dept Form */}
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Department Name
              </label>
              <input 
                type="text" 
                value={newDeptName} 
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="e.g. Product Engineering"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Purpose
              </label>
              <input 
                type="text" 
                value={newDeptDesc} 
                onChange={(e) => setNewDeptDesc(e.target.value)}
                placeholder="Core development, QA, and architecture teams"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={savingDept}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-750 border border-slate-750 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>{savingDept ? 'Creating...' : 'Create Department'}</span>
            </button>
          </form>

          {/* Existing Departments List */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Active Departments</span>
              <span className="text-blue-400">{departments.length} Units</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {departments.map((dept) => (
                <div key={dept._id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>{dept.name}</span>
                  </div>
                  {dept.description && (
                    <p className="text-[11px] text-slate-400 mt-1 truncate" title={dept.description}>
                      {dept.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
