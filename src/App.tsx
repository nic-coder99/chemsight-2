import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import {
  getStoredUserProfile,
  saveUserProfile,
  getStoredCorrections,
  getStoredExercises,
  getStoredHomeworkSubmissions,
  getRoomsForUser,
  isUserLoggedIn,
  logoutUser,
  getFallbackUserProfile,
} from './utils/storage';
import { StudentHome } from './components/StudentHome';
import { StudentRoomView } from './components/StudentRoomView';
import { QuizView } from './components/QuizView';
import { DrawingLab } from './components/DrawingLab';
import { NotesViewer } from './components/NotesViewer';
import { CorrectionVault } from './components/CorrectionVault';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AuthProfileModal } from './components/AuthProfileModal';
import { AuthScreen } from './components/AuthScreen';
import {
  Flame,
  Sparkles,
  BookOpen,
  Pencil,
  Eye,
  GraduationCap,
  Award,
  User,
  Home,
  AlertCircle,
  Atom,
  Users,
  LogOut,
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserLoggedIn());
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getStoredUserProfile() || getFallbackUserProfile());
  const [activeTab, setActiveTab] = useState<'home' | 'rooms' | 'quiz' | 'drawing' | 'notes' | 'corrections' | 'teacher'>(
    currentUser.role === 'teacher' ? 'teacher' : 'home'
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selected3DModelId, setSelected3DModelId] = useState<string | undefined>();
  const [drawingChallengeId, setDrawingChallengeId] = useState<string | undefined>();
  const [correctionsCount, setCorrectionsCount] = useState<number>(0);
  const [pendingHomeworkCount, setPendingHomeworkCount] = useState<number>(0);

  // If user is not authenticated yet, render the gateway AuthScreen
  if (!isAuthenticated || !currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setActiveTab(user.role === 'teacher' ? 'teacher' : 'home');
        }}
      />
    );
  }

  // Sync corrections count badge & homework count badge
  useEffect(() => {
    const corrs = getStoredCorrections(currentUser.id);
    setCorrectionsCount(corrs.filter((c) => !c.isResolved).length);

    if (currentUser.role === 'student') {
      const userRooms = getRoomsForUser(currentUser);
      let pending = 0;
      userRooms.forEach((r) => {
        const exs = getStoredExercises(r.id);
        const subs = getStoredHomeworkSubmissions(r.id, undefined, currentUser.id);
        pending += Math.max(0, exs.length - subs.length);
      });
      setPendingHomeworkCount(pending);
    }
  }, [currentUser.id, currentUser.role, activeTab]);

  const handleUpdateXP = (addedXp: number) => {
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        xp: prev.xp + addedXp,
      };
      saveUserProfile(updated);
      return updated;
    });
  };

  const handleNavigateTo3DModel = (modelId: string) => {
    setSelected3DModelId(modelId);
    setActiveTab('notes');
  };

  const handleNavigateToDrawing = (challengeId?: string) => {
    setDrawingChallengeId(challengeId);
    setActiveTab('drawing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-blue-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab(currentUser.role === 'teacher' ? 'teacher' : 'home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-blue-200 group-hover:scale-105 transition transform">
              ⚛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-blue-950 group-hover:text-blue-600 transition">
                  ChemSight
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-black rounded-full uppercase tracking-wider">
                  SPM 2026
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 hidden sm:block">
                Interactive Chemistry & Mistake Vault
              </span>
            </div>
          </button>

          {/* Center Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-2">
            {currentUser.role === 'student' ? (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'home'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('rooms')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'rooms'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Class Rooms</span>
                  {pendingHomeworkCount > 0 && (
                    <span className="px-2 py-0.2 bg-blue-600 text-white text-[10px] font-black rounded-full">
                      {pendingHomeworkCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Flame className="w-4 h-4 text-sky-500" />
                  <span>SPM Hot List</span>
                </button>

                <button
                  onClick={() => setActiveTab('drawing')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'drawing'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                  <span>Interactive Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'notes'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span>3D Library</span>
                </button>

                <button
                  onClick={() => setActiveTab('corrections')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'corrections'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Correction Box</span>
                  {correctionsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                      {correctionsCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              /* Teacher Nav Items */
              <>
                <button
                  onClick={() => setActiveTab('teacher')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'teacher'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Teacher Portal & Rooms</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Flame className="w-4 h-4 text-sky-500" />
                  <span>SPM Hot List</span>
                </button>

                <button
                  onClick={() => setActiveTab('drawing')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'drawing'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                  <span>Interactive Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`text-sm font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'notes'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-xs font-black'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span>3D Library</span>
                </button>
              </>
            )}
          </nav>

          {/* Right User & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Streak & XP Pills (Student) */}
            {currentUser.role === 'student' && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentUser.xp} XP</span>
                </div>

                <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentUser.streakDays}d</span>
                </div>
              </div>
            )}

            {/* Profile & Sign In / Log In Switcher Button */}
            <div className="flex items-center gap-2 pl-3 sm:pl-5 border-l border-slate-200">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 text-left group cursor-pointer bg-slate-50 hover:bg-blue-50/80 px-2.5 sm:px-3 py-1.5 rounded-2xl border border-slate-200 hover:border-blue-200 transition"
                title="Profile & Account Settings"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 border border-blue-200 shadow-2xs overflow-hidden flex items-center justify-center text-base sm:text-lg shrink-0">
                  {currentUser.avatar === 'atomie' ? '⚛️' : currentUser.avatar === 'beaker' ? '🧪' : currentUser.avatar === 'ellie' ? '⚡' : '🫧'}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition">
                      {currentUser.name}
                    </p>
                    <span className="text-[10px] text-blue-500 font-bold">▾</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {currentUser.role === 'teacher' ? '👩‍🏫 Teacher' : `🎓 ${currentUser.form}`} • Profile
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setIsAuthenticated(false);
                }}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer flex items-center gap-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-bold hidden md:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-slate-50 border-t border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
          {currentUser.role === 'student' ? (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`px-3 py-1.5 rounded-full transition flex items-center gap-1 ${activeTab === 'rooms' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                <span>Rooms</span>
                {pendingHomeworkCount > 0 && (
                  <span className="px-1.5 bg-blue-600 text-white text-[9px] rounded-full font-black">
                    {pendingHomeworkCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'quiz' ? 'bg-sky-600 text-white' : 'text-slate-600'}`}
              >
                Hot List
              </button>
              <button
                onClick={() => setActiveTab('drawing')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'drawing' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Lab
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                3D Notes
              </button>
              <button
                onClick={() => setActiveTab('corrections')}
                className={`px-3 py-1.5 rounded-full transition flex items-center gap-1 ${activeTab === 'corrections' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                <span>Corrections</span>
                {correctionsCount > 0 && (
                  <span className="px-1.5 bg-blue-600 text-white text-[9px] rounded-full font-black">
                    {correctionsCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'teacher' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Teacher Portal
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'quiz' ? 'bg-sky-600 text-white' : 'text-slate-600'}`}
              >
                Hot List
              </button>
              <button
                onClick={() => setActiveTab('drawing')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'drawing' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Lab
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-full transition ${activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                3D Notes
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        {activeTab === 'home' && (
          <StudentHome
            user={currentUser}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelect3DModel={handleNavigateTo3DModel}
          />
        )}

        {activeTab === 'rooms' && (
          <StudentRoomView
            user={currentUser}
            onNavigateTo3DModel={handleNavigateTo3DModel}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            user={currentUser}
            onNavigateToCorrections={() => setActiveTab('corrections')}
            onNavigateTo3DModel={handleNavigateTo3DModel}
            onUpdateUserXP={handleUpdateXP}
          />
        )}

        {activeTab === 'drawing' && (
          <DrawingLab
            user={currentUser}
            initialChallengeId={drawingChallengeId}
            onSubmissionSuccess={() => {
              handleUpdateXP(50);
            }}
          />
        )}

        {activeTab === 'notes' && (
          <NotesViewer
            initialModelId={selected3DModelId}
            onNavigateToDrawing={handleNavigateToDrawing}
          />
        )}

        {activeTab === 'corrections' && (
          <CorrectionVault
            user={currentUser}
            onUpdateUserXP={handleUpdateXP}
            onNavigateTo3DModel={handleNavigateTo3DModel}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard teacher={currentUser} />
        )}
      </main>

      {/* Auth & Profile Switcher Modal */}
      <AuthProfileModal
        currentUser={currentUser}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserChange={(updated) => {
          setCurrentUser(updated);
          if (updated.role === 'teacher') setActiveTab('teacher');
          else if (activeTab === 'teacher') setActiveTab('home');
        }}
        onLogout={() => {
          logoutUser();
          setIsAuthenticated(false);
        }}
      />
    </div>
  );
}
