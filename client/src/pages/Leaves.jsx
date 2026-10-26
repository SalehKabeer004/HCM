import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  Send,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Check,
  X,
  FileText,
  Calendar,
  Search
} from 'lucide-react';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const token = localStorage.getItem('token');
  let userRole = 'Employee';
  try {
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        userRole = JSON.parse(atob(parts[1])).role || 'Employee';
      }
    }
  } catch {
    // fallback
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch {
      setError('Failed to fetch leave requests.');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leaves`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Leave request submitted successfully!');
      setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leaves/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeaves();
    } catch {
      setError('Failed to update leave status.');
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'ALL' || leave.status?.toUpperCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Absence Management & Workflow</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Leave Requests & Approvals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Apply for planned leaves, view manager approval timelines, and review department balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Total Requests</div>
            <div className="text-lg font-bold text-slate-100">{leaves.length}</div>
          </div>
        </div>
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

      {/* Grid: Apply Form + Requests Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Apply Form */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl lg:col-span-1 h-fit space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Apply for Leave</h2>
              <p className="text-xs text-slate-400">Request time off from supervisor</p>
            </div>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Leave Category
              </label>
              <select 
                value={formData.leaveType} 
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input 
                type="date" 
                value={formData.startDate} 
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required 
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input 
                type="date" 
                value={formData.endDate} 
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required 
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Reason / Remarks
              </label>
              <textarea 
                value={formData.reason} 
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Brief justification for leave..."
                required 
                rows="3"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {submitting ? 'Submitting Application...' : 'Submit Leave Request'}
            </button>
          </form>
        </div>

        {/* Right Column: Requests Table */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl lg:col-span-2 space-y-5">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Leave Applications</h2>
              <p className="text-xs text-slate-400">Track and manage leave requests</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search requests..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all w-40 sm:w-52"
                />
              </div>

              <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterStatus(filter)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                      filterStatus === filter
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

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Details</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Status</th>
                  {userRole !== 'Employee' && <th className="py-3 px-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={userRole !== 'Employee' ? 5 : 4} className="py-8 text-center text-slate-400">
                      No leave requests found matching the current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-800/40 transition-colors duration-150">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                            {leave.employee?.name ? leave.employee.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100">{leave.employee?.name || 'User'}</div>
                            <div className="text-[11px] text-slate-400">{leave.employee?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{leave.leaveType}</div>
                        <div className="text-[11px] text-slate-400 max-w-xs truncate" title={leave.reason}>
                          {leave.reason}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300 font-mono whitespace-nowrap">
                        {leave.startDate} → {leave.endDate}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : leave.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {leave.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                          {leave.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {leave.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {leave.status}
                        </span>
                      </td>

                      {userRole !== 'Employee' && (
                        <td className="py-3 px-4">
                          {leave.status === 'Pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-all"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition-all"
                              >
                                <X className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500">Processed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
