import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Radio,
  ArrowRight,
  Compass,
  Building2
} from 'lucide-react';

export default function Attendance() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [coords, setCoords] = useState(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setMessage('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };

          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/attendance/check-in`, {
            lat: latitude,
            lng: longitude
          }, config);

          setMessage(res.data.message || 'Attendance recorded successfully!');
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.error || 'Check-in failed.');
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || 'Failed to get your location. Please enable location permissions.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-time GPS Attendance Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Daily Geolocation Punch-In
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Authenticate your physical presence at the workplace through precision GPS geofencing.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Live Digital Clock Display */}
        <div className="text-center py-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Current System Time</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-mono">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-xs text-slate-400">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Radar Animation Graphic */}
        <div className="flex justify-center my-6">
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-60"></div>
            <div className="absolute inset-2 rounded-full border border-blue-500/30"></div>
            <div className="absolute inset-6 rounded-full border border-indigo-500/40"></div>
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 z-10">
              <MapPin className="w-7 h-7 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{message}</p>
              {coords && (
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  GPS Coordinates captured: ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-2xl text-sm font-bold text-white shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 ${
            loading
              ? 'bg-slate-800 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/50'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Triangulating GPS & Verifying Radius...</span>
            </>
          ) : (
            <>
              <Compass className="w-5 h-5" />
              <span>Punch In Now (GPS Verify)</span>
            </>
          )}
        </button>

        {/* Guidelines */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-slate-400">
              <span className="block text-slate-200 font-semibold">Office Geofence</span>
              150m allowed radius
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-slate-400">
              <span className="block text-slate-200 font-semibold">Shift Schedule</span>
              09:00 AM (15m grace)
            </div>
          </div>
        </div>

        {/* Link to History */}
        <div className="text-center pt-2">
          <Link
            to="/attendance-history"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Review your past attendance logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
