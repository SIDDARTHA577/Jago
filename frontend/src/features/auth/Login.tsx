import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, User, Phone, MapPin, Hash, UserCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { Profile } from '../../types';
import { Button } from '../../components/ui/Button';

export interface LoginProps {
  onLoginSuccess: (user: Profile) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Maharashtra',
  'Gujarat',
  'Delhi',
  'Odisha',
  'West Bengal',
  'Other'
];

interface PasswordStrength {
  score: number; // 0 to 4
  label: string;
  color: string;
  textColor: string;
  width: string;
}

function calculatePasswordStrength(pass: string): PasswordStrength {
  if (!pass) {
    return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400', width: '0%' };
  }

  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600', width: '25%' };
  } else if (score === 2 || score === 3) {
    return { score: 2, label: 'Fair / Medium', color: 'bg-amber-500', textColor: 'text-amber-600', width: '60%' };
  } else if (score === 4) {
    return { score: 3, label: 'Strong', color: 'bg-teal-500', textColor: 'text-teal-600', width: '85%' };
  } else {
    return { score: 4, label: 'Very Strong', color: 'bg-emerald-600', textColor: 'text-emerald-600', width: '100%' };
  }
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('pilot@jago.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form States (Collecting Name, Email, Mobile Number, Password, Confirm Password, Address, State, Pincode)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regState, setRegState] = useState('Andhra Pradesh');
  const [regPincode, setRegPincode] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const passwordStrength = calculatePasswordStrength(regPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const user = await authService.login(loginEmail, loginPassword);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!regPhone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please ensure both password fields match exactly.');
      return;
    }
    if (!regAddress.trim()) {
      setError('Please enter your street address.');
      return;
    }
    if (!regPincode.trim()) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);

    try {
      // By default, all newly created accounts are registered as 'pilot'
      const user = await authService.register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        address: regAddress.trim(),
        state: regState,
        pincode: regPincode.trim(),
        role_key: 'pilot'
      });

      setSuccessMsg('Account created successfully as Pilot Driver! Redirecting to your dashboard...');
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300 my-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-cyan-500 mx-auto flex items-center justify-center shadow-xl shadow-indigo-600/20 ring-4 ring-white transform hover:scale-105 transition-all">
            <Shield className="w-10 h-10 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-mono tracking-widest bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
              JAGO
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Pilot Access & Document Verification Platform</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 bg-white/95 border border-slate-200">
          {/* Auth Tab Switcher (Sign In vs Create Account) */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {authMode === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="name@jago.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3 text-sm font-bold shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Jago Platform
              </Button>
            </form>
          ) : (
            /* Create Account Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    placeholder="e.g. K. Rajesh Varma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      placeholder="driver@jago.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      placeholder="+91 94401 23456"
                    />
                  </div>
                </div>
              </div>

              {/* Set Password with Password Strength Indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Set Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      placeholder="At least 6 chars"
                    />
                  </div>
                  {/* Password Strength Indicator */}
                  {regPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Strength:</span>
                        <span className={`font-bold ${passwordStrength.textColor}`}>{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 shadow-sm ${
                        regConfirmPassword && regConfirmPassword !== regPassword
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                      placeholder="Re-enter password"
                    />
                  </div>
                  {regConfirmPassword && regConfirmPassword !== regPassword && (
                    <p className="text-[10px] text-rose-600 font-medium mt-1">Passwords do not match</p>
                  )}
                  {regConfirmPassword && regConfirmPassword === regPassword && (
                    <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Street / Residential Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={e => setRegAddress(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    placeholder="Door No, Street Name, Area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State
                  </label>
                  <select
                    value={regState}
                    onChange={e => setRegState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pincode
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={regPincode}
                      onChange={e => setRegPincode(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-mono"
                      placeholder="520010"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3 text-sm font-bold shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700"
                icon={<UserCheck className="w-4 h-4" />}
              >
                Create Account & Register as Pilot Driver
              </Button>
            </form>
          )}
        </div>

        {/* Security Footer Note */}
        <p className="text-[11px] text-center text-slate-500 font-medium">
          Protected by Supabase Auth, PostgreSQL RLS & Private Document Storage
        </p>
      </div>
    </div>
  );
};
