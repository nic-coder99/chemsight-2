import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  loginAccount,
  registerAccount,
} from '../utils/storage';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  School,
  ArrowRight,
  ShieldCheck,
  Flame,
  Atom,
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Role Selection: 'student' | 'teacher'
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAge, setRegAge] = useState<number | ''>(16);
  const [regForm, setRegForm] = useState<'Form 4' | 'Form 5'>('Form 5');
  const [regSchool, setRegSchool] = useState('SMK');
  const [regClass, setRegClass] = useState('');
  const [regAvatar, setRegAvatar] = useState('atomie');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Standard Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or username');
      return;
    }

    const result = loginAccount(loginEmail.trim(), loginPassword.trim() || undefined, selectedRole);
    if (result.success && result.user) {
      setLoginSuccess(result.message);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 400);
    } else {
      setLoginError(result.message);
    }
  };

  // Sign Up / Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter a valid email address');
      return;
    }

    const result = registerAccount({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim() || '123',
      role: selectedRole,
      age: selectedRole === 'student' && typeof regAge === 'number' ? regAge : undefined,
      form: selectedRole === 'teacher' ? 'Teacher' : regForm,
      avatar: regAvatar,
      school: regSchool.trim() || 'SMK',
      className: selectedRole === 'teacher' ? 'Head of Chemistry Dept' : regClass.trim() || '5 Sains 1',
    });

    if (result.success && result.user) {
      setRegSuccess(`Account created! Welcome, ${result.user.name}.`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 500);
    } else {
      setRegError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800 relative overflow-hidden">
      {/* Decorative ambient background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 text-8xl opacity-5 pointer-events-none select-none text-white">
        ⚛️
      </div>

      <div className="relative z-10 w-full max-w-xl my-6">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-sky-500 text-white rounded-2xl shadow-xl text-3xl font-black mb-1 ring-4 ring-white/10">
            🧪
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>ChemSight</span>
            <span className="px-2.5 py-0.5 bg-sky-400 text-blue-950 text-xs font-black rounded-full uppercase tracking-wider">
              SPM Chemistry
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 font-medium max-w-md mx-auto">
            Interactive Form 4 & Form 5 Chemistry, 3D Models, Bond Drawing, & Mistake Vault
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100/50 space-y-6">
          {/* Top Auth Mode Tabs (Log In vs Sign Up) */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-white text-blue-950 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4 text-blue-600" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setRegError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-white text-blue-950 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Sign Up / Register</span>
            </button>
          </div>

          {/* Form 4 & 5 Open Access Notice */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-950">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-black text-blue-900">
                Form 4 & Form 5 Full Access:
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Students can freely practice and access both <strong>Form 4</strong> and <strong>Form 5</strong> notes, 3D models, and quizzes <strong>regardless of age or grade</strong>!
              </p>
            </div>
          </div>

          {/* -------------------- 1. LOG IN TAB -------------------- */}
          {authMode === 'login' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  1. Are you a Teacher or a Student?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Student Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedRole === 'student'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🎓</span>
                      {selectedRole === 'student' && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-blue-950">Student</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Access all Form 4 & 5 topics, hot quizzes, 3D notes & homework.
                      </p>
                    </div>
                  </button>

                  {/* Teacher Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedRole === 'teacher'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">👩‍🏫</span>
                      {selectedRole === 'teacher' && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-blue-950">Teacher</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Manage classrooms, assign homework, and review drawings.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  Log In with Email & Password:
                </span>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email or Username:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. adam@spm.edu.my or Adam Zikri"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password:</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {loginSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{loginSuccess}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    Need an account? Sign Up →
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-blue-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In as {selectedRole === 'teacher' ? 'Teacher' : 'Student'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* -------------------- 2. SIGN UP / REGISTER TAB -------------------- */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
              {/* Role Choice */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  1. Select Account Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-center gap-3 ${
                      selectedRole === 'student'
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl">🎓</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-blue-950">Student</h4>
                      <p className="text-[10px] text-slate-500 font-medium">All Form 4 & 5 topics unlocked</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-center gap-3 ${
                      selectedRole === 'teacher'
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl">👩‍🏫</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-blue-950">Teacher</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Class management & grading</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nurul Huda / Tan Wei Ming"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. student@school.edu.my"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password:</label>
                  <input
                    type="password"
                    placeholder="e.g. 123456"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>

                {selectedRole === 'student' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Age:</span>
                      <span className="text-[10px] text-blue-600 font-bold">F4 & F5 both open</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="99"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                      placeholder="e.g. 16 or 17"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Designation / Role:</label>
                    <input
                      type="text"
                      disabled
                      value="Chemistry Teacher & Room Admin"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    />
                  </div>
                )}
              </div>

              {/* School & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">School Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. SMK"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {selectedRole === 'student' ? 'Class Name:' : 'Department:'}
                  </label>
                  <input
                    type="text"
                    placeholder={selectedRole === 'student' ? 'e.g. 5 Sains 1 or 4 STEM' : 'e.g. Science Dept'}
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Choose Mascot Avatar */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Choose Chemistry Mascot Avatar:</label>
                <div className="flex items-center gap-2.5">
                  {[
                    { id: 'atomie', icon: '⚛️', name: 'Atomie' },
                    { id: 'beaker', icon: '🧪', name: 'Beakie' },
                    { id: 'ellie', icon: '⚡', name: 'Ellie' },
                    { id: 'bubble', icon: '🫧', name: 'Bubbles' },
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setRegAvatar(av.id)}
                      className={`flex-1 p-2 rounded-2xl border-2 text-center transition cursor-pointer ${
                        regAvatar === av.id
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="text-2xl block">{av.icon}</span>
                      <span className="text-[10px] font-bold text-slate-700 block mt-0.5">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                >
                  Already have an account? Log In →
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-blue-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create {selectedRole === 'teacher' ? 'Teacher' : 'Student'} Account</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
