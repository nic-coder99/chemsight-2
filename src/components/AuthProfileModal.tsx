import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  loginAccount,
  registerAccount,
  saveUserProfile,
} from '../utils/storage';
import {
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  X,
  Flame,
  Award,
  BookOpen,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  School,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AuthProfileModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: UserProfile) => void;
  onLogout?: () => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserChange,
  onLogout,
}) => {
  // Mode: 'login' | 'register' | 'profile_edit'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'profile_edit'>('login');

  // Shared / Selection State
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

  // Edit Profile State
  const [editName, setEditName] = useState(currentUser.name);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editClass, setEditClass] = useState(currentUser.className || '');
  const [editAge, setEditAge] = useState<number | ''>(currentUser.age || 16);

  if (!isOpen) return null;

  // Handle Standard Login
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
        onUserChange(result.user!);
        setLoginSuccess(null);
        onClose();
      }, 500);
    } else {
      setLoginError(result.message);
    }
  };

  // Handle Sign Up (Register)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter an email address');
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
      school: regSchool.trim() || 'SMK Seri Bintang',
      className: selectedRole === 'teacher' ? 'Head of Chemistry Dept' : regClass.trim() || '5 Sains 1',
    });

    if (result.success && result.user) {
      setRegSuccess(`Welcome, ${result.user.name}! Your ${selectedRole} account is created.`);
      setTimeout(() => {
        onUserChange(result.user!);
        setRegSuccess(null);
        onClose();
      }, 600);
    } else {
      setRegError(result.message);
    }
  };

  // Handle Edit Profile Save
  const handleSaveProfile = () => {
    const updated: UserProfile = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      avatar: editAvatar,
      className: editClass.trim() || currentUser.className,
      age: typeof editAge === 'number' ? editAge : currentUser.age,
    };
    saveUserProfile(updated);
    onUserChange(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border-2 border-blue-100 animate-fadeIn my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl font-bold shadow-xs">
              {currentUser.avatar === 'atomie' ? '⚛️' : currentUser.avatar === 'beaker' ? '🧪' : currentUser.avatar === 'ellie' ? '⚡' : '🫧'}
            </div>
            <div>
              <h3 className="text-base font-black text-blue-950 flex items-center gap-1.5">
                <span>Account & Sign In Center</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Current: <strong className="text-blue-900">{currentUser.name}</strong> ({currentUser.role === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs (Log In vs Sign Up vs Edit Profile) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setRegError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Sign Up / Register</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('profile_edit')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'profile_edit'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Profile</span>
          </button>
        </div>

        {/* Notice Banner: Students can view Form 4 & Form 5 regardless of age! */}
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-950">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-black text-blue-900">
              Form 4 & Form 5 Full Access:
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Students can freely access and practice both <strong>Form 4 (Tingkatan 4)</strong> and <strong>Form 5 (Tingkatan 5)</strong> chapters, 3D visual notes, and quizzes <strong>regardless of age or grade level</strong>!
            </p>
          </div>
        </div>

        {/* ------------------- 1. LOG IN TAB ------------------- */}
        {authMode === 'login' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Step: Ask if you are a Teacher or a Student */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                1. Are you a Teacher or a Student?
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Student Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
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
                    <h4 className="text-xs font-black text-blue-950">Student</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Full access to Form 4 & Form 5, 2026 Hot List, 3D notes, and mistake box.
                    </p>
                  </div>
                </button>

                {/* Teacher Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
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
                    <h4 className="text-xs font-black text-blue-950">Teacher</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Create classrooms, assign bond drawing homework, grade submissions, view analytics.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                Log In With Email & Password:
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
                  Don't have an account? Sign Up →
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In as {selectedRole === 'teacher' ? 'Teacher' : 'Student'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------- 2. SIGN UP / REGISTER TAB ------------------- */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
            {/* Step 1: Teacher vs Student Choice */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
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
                    <h4 className="text-xs font-black text-blue-950">Student</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Access all Form 4 & Form 5 content</p>
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
                    <h4 className="text-xs font-black text-blue-950">Teacher</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Manage classes & assign homework</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Name & Email & Password */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Create Password:</label>
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
                    <span className="text-[10px] text-blue-600 font-bold">All Form 4 & 5 unlocked</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="99"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600 focus:bg-white"
                    placeholder="e.g. 16 or 17 (Any age can view all forms)"
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

            {/* School & Class Information */}
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
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create {selectedRole === 'teacher' ? 'Teacher' : 'Student'} Account</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------- 3. EDIT PROFILE TAB ------------------- */}
        {authMode === 'profile_edit' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl font-bold">
                  {currentUser.avatar === 'atomie' ? '⚛️' : currentUser.avatar === 'beaker' ? '🧪' : currentUser.avatar === 'ellie' ? '⚡' : '🫧'}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{currentUser.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {currentUser.role === 'teacher' ? 'Teacher' : `Student • ${currentUser.form}`} • {currentUser.school || 'SMK'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-blue-600">{currentUser.xp} XP</span>
                <p className="text-[10px] text-blue-500 font-bold">{currentUser.streakDays} Day Streak 🔥</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Display Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Class / Section:</label>
                  <input
                    type="text"
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600"
                  />
                </div>

                {currentUser.role === 'student' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Age (All Forms Unlocked):</label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-600"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Update Avatar:</label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'atomie', icon: '⚛️', name: 'Atomie' },
                    { id: 'beaker', icon: '🧪', name: 'Beakie' },
                    { id: 'ellie', icon: '⚡', name: 'Ellie' },
                    { id: 'bubble', icon: '🫧', name: 'Bubbles' },
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setEditAvatar(av.id)}
                      className={`flex-1 p-2 rounded-2xl border-2 text-center transition cursor-pointer ${
                        editAvatar === av.id
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
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Switch Account
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl cursor-pointer transition"
                  >
                    Log Out
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
