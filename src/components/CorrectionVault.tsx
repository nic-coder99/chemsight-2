import React, { useState, useEffect } from 'react';
import { CorrectionItem, UserProfile } from '../types';
import { getStoredCorrections, resolveCorrectionItem } from '../utils/storage';
import { SPM_CHAPTERS } from '../data/chemistryData';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Lightbulb,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

interface CorrectionVaultProps {
  user: UserProfile;
  onUpdateUserXP: (addedXp: number) => void;
  onNavigateTo3DModel?: (modelId: string) => void;
}

export const CorrectionVault: React.FC<CorrectionVaultProps> = ({
  user,
  onUpdateUserXP,
  onNavigateTo3DModel,
}) => {
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [activeRetryItem, setActiveRetryItem] = useState<CorrectionItem | null>(null);
  const [retrySelectedOption, setRetrySelectedOption] = useState<number | null>(null);
  const [retrySubmitted, setRetrySubmitted] = useState(false);

  // Load corrections
  useEffect(() => {
    setCorrections(getStoredCorrections(user.id));
  }, [user.id]);

  const filteredItems = corrections.filter((item) => {
    if (activeFilter === 'unresolved' && item.isResolved) return false;
    if (activeFilter === 'resolved' && !item.isResolved) return false;
    if (selectedChapter !== 'all' && item.chapterId !== selectedChapter) return false;
    return true;
  });

  const unresolvedCount = corrections.filter((c) => !c.isResolved).length;
  const resolvedCount = corrections.filter((c) => c.isResolved).length;

  const handleStartRetry = (item: CorrectionItem) => {
    setActiveRetryItem(item);
    setRetrySelectedOption(null);
    setRetrySubmitted(false);
  };

  const handleSubmitRetry = () => {
    if (retrySelectedOption === null || !activeRetryItem) return;
    setRetrySubmitted(true);

    const isCorrect = retrySelectedOption === activeRetryItem.correctAnswer;
    if (isCorrect) {
      resolveCorrectionItem(activeRetryItem.id);
      onUpdateUserXP(25); // Bonus XP for mastering correction

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Update state
      setCorrections((prev) =>
        prev.map((c) => (c.id === activeRetryItem.id ? { ...c, isResolved: true } : c))
      );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
              Buku Pembetulan SPM 📖
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Chemistry Correction Vault
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl">
            Questions you answered incorrectly are stored here automatically. Review step-by-step examiners' guides and retry them to turn mistakes into full marks!
          </p>
        </div>

        {/* Counter Stats */}
        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <div className="text-center px-3 border-r border-white/20">
            <span className="text-xl font-black">{unresolvedCount}</span>
            <p className="text-[10px] font-bold uppercase opacity-80">Needs Revision</p>
          </div>
          <div className="text-center px-3">
            <span className="text-xl font-black text-orange-200">{resolvedCount}</span>
            <p className="text-[10px] font-bold uppercase opacity-80">Mastered ⭐</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-indigo-50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Mistakes ({corrections.length})
          </button>

          <button
            onClick={() => setActiveFilter('unresolved')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'unresolved'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Needs Revision ({unresolvedCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'resolved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered ({resolvedCount})</span>
          </button>
        </div>

        {/* Chapter filter selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <label htmlFor="vault-chapter-select" className="sr-only">Filter by Chapter</label>
          <select
            id="vault-chapter-select"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-indigo-500 cursor-pointer"
          >
            <option value="all">All Chapters</option>
            {SPM_CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mistake Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-indigo-50 p-12 text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl">
            🎉
          </div>
          <h3 className="text-lg font-black text-indigo-900">
            {activeFilter === 'unresolved' ? 'No Pending Corrections!' : 'Correction Vault is Clean!'}
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            {activeFilter === 'unresolved'
              ? 'Awesome job! You have cleared all questions from your correction list.'
              : 'Take more SPM Hot Quizzes. Any mistake you make will show up here automatically for targeted revision.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const chapter = SPM_CHAPTERS.find((c) => c.id === item.chapterId);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border-2 transition shadow-sm p-6 space-y-4 ${
                  item.isResolved
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 hover:border-rose-300'
                }`}
              >
                {/* Header tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 text-xs font-black rounded-full flex items-center gap-1.5 ${
                        item.isResolved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {item.isResolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mastered ⭐</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Needs Revision 🚨</span>
                        </>
                      )}
                    </span>

                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {chapter?.title || item.chapterId}
                    </span>

                    {item.question.isHot2026 && (
                      <span className="text-xs font-black text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-600" />
                        <span>SPM 2026 Target</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">
                    Recorded {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                {/* Question Details */}
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
                    {item.question.questionText}
                  </h4>
                  {item.question.questionTextBM && (
                    <p className="text-xs text-slate-500 italic">{item.question.questionTextBM}</p>
                  )}
                </div>

                {/* Wrong Answer vs Correct Answer Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-2xl text-xs space-y-1">
                    <span className="font-black text-rose-700 flex items-center gap-1">
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>Your Previous Answer:</span>
                    </span>
                    <p className="text-rose-900 font-medium">
                      {item.question.options
                        ? item.question.options[Number(item.studentAnswer)] || 'Option selected'
                        : String(item.studentAnswer)}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-1">
                    <span className="font-black text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Correct Answer (SPM Standard):</span>
                    </span>
                    <p className="text-emerald-900 font-bold">
                      {item.question.options
                        ? item.question.options[Number(item.correctAnswer)] || 'Standard option'
                        : String(item.correctAnswer)}
                    </p>
                  </div>
                </div>

                {/* Examiner Explanation & Mnemonic */}
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-orange-900 font-black">
                    <Lightbulb className="w-4 h-4 text-orange-600" />
                    <span>Key SPM Solution & Misconception:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {item.question.explanation}
                  </p>

                  {item.question.keyMnemonic && (
                    <div className="p-2 bg-white/80 rounded-xl border border-orange-200 text-orange-900 font-bold">
                      {item.question.keyMnemonic}
                    </div>
                  )}

                  {item.question.commonMistakes && (
                    <p className="text-slate-500 text-[11px] italic">
                      ⚠️ <strong>Examiner Warning:</strong> {item.question.commonMistakes}
                    </p>
                  )}
                </div>

                {/* Retry / Resolve Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400">
                    Attempts made: {item.attemptsCount}
                  </span>

                  <button
                    onClick={() => handleStartRetry(item)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{item.isResolved ? 'Practice Again' : 'Retry to Fix Question'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retry Modal */}
      {activeRetryItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-indigo-100 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-black rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Correction Challenge (Fix & Earn +25 XP)</span>
              </span>

              <button
                onClick={() => setActiveRetryItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-800">
                {activeRetryItem.question.questionText}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {activeRetryItem.question.options?.map((opt, idx) => {
                const isSelected = retrySelectedOption === idx;
                const isCorrect = idx === activeRetryItem.correctAnswer;

                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700';

                if (retrySubmitted) {
                  if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                  else if (isSelected && !isCorrect) btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 font-bold';
                  else btnStyle = 'opacity-50 border-slate-200';
                } else if (isSelected) {
                  btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-300';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!retrySubmitted) setRetrySelectedOption(idx);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs font-medium transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {retrySubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {retrySubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Modal Actions */}
            {!retrySubmitted ? (
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveRetryItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitRetry}
                  disabled={retrySelectedOption === null}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-200 transition"
                >
                  Submit Correction
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-3 border-t border-slate-100 animate-fadeIn">
                {retrySelectedOption === activeRetryItem.correctAnswer ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h4 className="text-xs font-black text-emerald-900">Mastered! You solved your mistake!</h4>
                      <p className="text-[11px] text-emerald-700 font-medium">+25 XP added to your chemistry rank.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="text-xs font-black text-rose-900">Keep Practicing!</h4>
                      <p className="text-[11px] text-rose-700 font-medium">Refer to the step-by-step notes above and give it another try.</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveRetryItem(null)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
