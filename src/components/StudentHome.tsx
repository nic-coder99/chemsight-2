import React, { useState } from 'react';
import { UserProfile, SPMChapter } from '../types';
import { SPM_CHAPTERS, SPM_QUESTIONS } from '../data/chemistryData';
import { getStoredCorrections, getRoomsForUser, getStoredExercises, getStoredHomeworkSubmissions } from '../utils/storage';
import {
  Flame,
  Sparkles,
  BookOpen,
  Pencil,
  Eye,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Atom,
  Users,
  KeyRound,
  Lock,
  Compass,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface StudentHomeProps {
  user: UserProfile;
  onNavigate: (tab: 'home' | 'rooms' | 'quiz' | 'drawing' | 'notes' | 'corrections' | 'teacher') => void;
  onSelect3DModel?: (modelId: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  user,
  onNavigate,
  onSelect3DModel,
}) => {
  const [syllabusTab, setSyllabusTab] = useState<'all' | 4 | 5>('all');
  const corrections = getStoredCorrections(user.id);
  const unresolvedCorrections = corrections.filter((c) => !c.isResolved);
  const userRooms = getRoomsForUser(user);
  const activeRoom = userRooms[0];
  const pendingHomeworkCount = activeRoom
    ? getStoredExercises(activeRoom.id).length - getStoredHomeworkSubmissions(activeRoom.id, undefined, user.id).length
    : 0;

  const filteredChapters = SPM_CHAPTERS.filter((chap) => {
    if (syllabusTab === 'all') return true;
    return chap.form === syllabusTab;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Cute Student Hero Card */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden border-2 border-indigo-400/30">
        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-12 text-6xl opacity-20 select-none pointer-events-none">
          ⚛️
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar Mascot Frame */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-lg">
                {user.avatar === 'atomie' ? '⚛️' : user.avatar === 'beaker' ? '🧪' : user.avatar === 'ellie' ? '⚡' : '🫧'}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-orange-400 text-slate-900 font-black text-[11px] rounded-full shadow-sm">
                Lvl {Math.floor(user.xp / 500) + 1}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                  {user.form} • {user.school || 'SMK Seri Bintang'}
                </span>
                {user.age && (
                  <span className="px-2.5 py-0.5 bg-white/15 text-white/90 font-bold text-xs rounded-full">
                    Age {user.age}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-orange-400/90 text-white font-black text-xs rounded-full flex items-center gap-1 shadow-xs">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>{user.streakDays} Day Streak!</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Hai, {user.name}! 🌟
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium max-w-lg">
                Welcome to your SPM Chemistry command center! Explore both Form 4 & Form 5 syllabus, complete teacher assignments, practice 2026 hot questions, and master mistakes.
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-row md:flex-col gap-2.5 self-start md:self-auto">
            <button
              onClick={() => onNavigate('rooms')}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-900/20 transition transform hover:scale-103 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-950" />
              <span>Enter Class Room</span>
            </button>

            {unresolvedCorrections.length > 0 && (
              <button
                onClick={() => onNavigate('corrections')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl backdrop-blur-md transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-white/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Fix Mistakes ({unresolvedCorrections.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Form Access Notice Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-blue-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shrink-0">
            📚
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black flex items-center gap-2">
              <span>Full Form 4 & Form 5 Access</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-950 text-[10px] font-black rounded-md uppercase">
                All Ages Unlocked
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-white/90 font-medium mt-0.5">
              Regardless of your age or enrolled grade, you can learn, browse 3D notes, and do quizzes for both <strong>Form 4 (Tingkatan 4)</strong> and <strong>Form 5 (Tingkatan 5)</strong> at any time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => {
              setSyllabusTab(4);
              const el = document.getElementById('syllabus-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-xl backdrop-blur-xs transition cursor-pointer"
          >
            Form 4 Syllabus
          </button>
          <button
            onClick={() => {
              setSyllabusTab(5);
              const el = document.getElementById('syllabus-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-black rounded-xl shadow-xs transition cursor-pointer"
          >
            Form 5 Syllabus
          </button>
        </div>
      </div>

      {/* Classroom Room Quick Link Banner */}
      {activeRoom ? (
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shrink-0">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-indigo-950">{activeRoom.name}</h4>
                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-black rounded-lg">
                  {activeRoom.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Teacher: <strong>{activeRoom.teacherName}</strong> • {activeRoom.school}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {pendingHomeworkCount > 0 && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-black rounded-full">
                {pendingHomeworkCount} Homework Due
              </span>
            )}
            <button
              onClick={() => onNavigate('rooms')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Room & Homework</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 border-2 border-dashed border-indigo-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
              🔑
            </div>
            <div>
              <h4 className="text-xs font-black text-indigo-950">Join Your Chemistry Teacher's Room</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Enter your teacher's code (e.g. <code>CHEM-501</code>) to submit homework and view assignments.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('rooms')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition cursor-pointer self-end sm:self-auto"
          >
            Enter Room Code
          </button>
        </div>
      )}

      {/* Feature Navigation Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Hot SPM Quizzes */}
        <button
          onClick={() => onNavigate('quiz')}
          className="bg-white p-6 rounded-3xl border-2 border-indigo-50 hover:border-indigo-200 hover:shadow-lg shadow-indigo-100/50 transition text-left space-y-3 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-400 flex items-center justify-center text-2xl text-white shadow-md shadow-orange-100 group-hover:scale-105 transition">
            🔥
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">Exam Trend Target</span>
            <h3 className="text-base font-black text-slate-800">2026 Hot Quizzes</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Top predicted SPM questions with instant automated mistake tracking!
            </p>
          </div>
        </button>

        {/* 2. Drawing Lab */}
        <button
          onClick={() => onNavigate('drawing')}
          className="bg-white p-6 rounded-3xl border-2 border-indigo-50 hover:border-indigo-200 hover:shadow-lg shadow-indigo-100/50 transition text-left space-y-3 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-2xl text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition">
            🎨
          </div>
          <div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Interactive Canvas</span>
            <h3 className="text-base font-black text-slate-800">Drawing Lab</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Draw atomic electron shells, chemical bonds & experiment apparatus.
            </p>
          </div>
        </button>

        {/* 3. 360 3D Notes */}
        <button
          onClick={() => onNavigate('notes')}
          className="bg-white p-6 rounded-3xl border-2 border-indigo-50 hover:border-indigo-200 hover:shadow-lg shadow-indigo-100/50 transition text-left space-y-3 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-400 to-cyan-500 flex items-center justify-center text-2xl text-white shadow-md shadow-blue-100 group-hover:scale-105 transition">
            🫧
          </div>
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">360° Rotation</span>
            <h3 className="text-base font-black text-slate-800">3D Visual Notes</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Interactive 3D molecules, crystal lattices, and qualitative test charts.
            </p>
          </div>
        </button>

        {/* 4. Correction Vault */}
        <button
          onClick={() => onNavigate('corrections')}
          className="bg-white p-6 rounded-3xl border-2 border-indigo-50 hover:border-indigo-200 hover:shadow-lg shadow-indigo-100/50 transition text-left space-y-3 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl text-white shadow-md shadow-amber-100 group-hover:scale-105 transition">
            📖
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">Buku Pembetulan</span>
            <h3 className="text-base font-black text-slate-800">Correction Box</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {unresolvedCorrections.length > 0
                ? `${unresolvedCorrections.length} mistakes waiting to be mastered!`
                : 'All past mistakes solved & mastered!'}
            </p>
          </div>
        </button>
      </div>

      {/* Form 4 & Form 5 Dual Syllabus Explorer */}
      <div id="syllabus-section" className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-black rounded-full flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>KSSM Chemistry Syllabus</span>
              </span>
              <span className="text-xs text-slate-400 font-bold hidden sm:inline">
                • Form 4 & Form 5 Complete Reference
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-indigo-900 tracking-tight mt-1">
              Explore All Chemistry Chapters (Form 4 & Form 5)
            </h2>
          </div>

          {/* Form 4 / Form 5 Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl gap-1 self-start sm:self-auto">
            <button
              onClick={() => setSyllabusTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                syllabusTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (F4 + F5)
            </button>
            <button
              onClick={() => setSyllabusTab(4)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                syllabusTab === 4
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Form 4</span>
              <span className="text-[10px] opacity-75 font-normal">({SPM_CHAPTERS.filter(c => c.form === 4).length})</span>
            </button>
            <button
              onClick={() => setSyllabusTab(5)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                syllabusTab === 5
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Form 5</span>
              <span className="text-[10px] opacity-75 font-normal">({SPM_CHAPTERS.filter(c => c.form === 5).length})</span>
            </button>
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChapters.map((chap) => (
            <div
              key={chap.id}
              className="p-5 rounded-3xl border-2 border-indigo-50 hover:border-indigo-200 bg-slate-50/50 hover:bg-white transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{chap.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full">
                      Form {chap.form}
                    </span>
                    {chap.hotProbability >= 90 && (
                      <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-black rounded-full flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                        <span>{chap.hotProbability}% Hot</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900">{chap.title}</h4>
                  <p className="text-[11px] font-bold text-slate-400">{chap.titleBM}</p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                  {chap.hotReason}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400">
                  {chap.totalQuestions} Questions Available
                </span>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
