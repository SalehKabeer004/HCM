import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  History,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Users
} from 'lucide-react';

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [radiusFilter, setRadiusFilter] = useState('ALL');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch attendance history.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((rec) => {
    const nameMatch =
      rec.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.date?.includes(searchTerm);
    const radiusMatch =
      radiusFilter === 'ALL' ||
      (radiusFilter === 'WITHIN' && rec.isWithinRadius) ||
      (radiusFilter === 'OUT' && !rec.isWithinRadius);
    return nameMatch && radiusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Attendance Logs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Attendance Records
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Historical logs of employee punch-ins with GPS coordinates and punctuality metrics.
          </p>
        </div>

        {/* Quick count */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Total Punches</div>
            <div className="text-lg font-bold text-slate-100">{records.length}</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or date..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all w-64 sm:w-80"
            />
          </div>

          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setRadiusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all text-[11px] ${
                radiusFilter === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setRadiusFilter('WITHIN')}
              className={`px-3 py-1 rounded-lg font-medium transition-all text-[11px] ${
                radiusFilter === 'WITHIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Within Radius
            </button>
            <button
              onClick={() => setRadiusFilter('OUT')}
              className={`px-3 py-1 rounded-lg font-medium transition-all text-[11px] ${
                radiusFilter === 'OUT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Out of Bounds
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Punctuality Status</th>
                <th className="py-3 px-4">Geofence Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No attendance records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-800/40 transition-colors duration-150">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                          {rec.employee?.name ? rec.employee.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{rec.employee?.name || 'Unknown User'}</div>
                          <div className="text-[11px] text-slate-400">{rec.employee?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-medium">
                      <div className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rec.date}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-mono">
                      <div className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{new Date(rec.checkInTime).toLocaleTimeString()}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {rec.status || 'Present'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {rec.isWithinRadius ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <ShieldCheck className="w-3 h-3 text-blue-400" />
                          Within Radius
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          Out of Bounds
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
