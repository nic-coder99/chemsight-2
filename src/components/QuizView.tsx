import React, { useState } from 'react';
import { Question, SPMChapterId, UserProfile } from '../types';
import { SPM_QUESTIONS, SPM_CHAPTERS } from '../data/chemistryData';
import { addCorrectionItem, recordQuizAttempt } from '../utils/storage';
import { BondDrawingCanvas } from './BondDrawingCanvas';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  BookOpen,
  RotateCcw,
  Award,
  AlertTriangle,
  Lightbulb,
  Layers,
  Eye,
  Pencil,
} from 'lucide-react';

interface QuizViewProps {
  user: UserProfile;
  onNavigateToCorrections: () => void;
  onNavigateTo3DModel?: (modelId: string) => void;
  onUpdateUserXP: (addedXp: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  user,
  onNavigateToCorrections,
  onNavigateTo3DModel,
  onUpdateUserXP,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'hot2026' | 'bond_drawing' | 'form4' | 'form5' | 'all' | SPMChapterId>('hot2026');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [drawingEvaluation, setDrawingEvaluation] = useState<{
    score: number;
    maxScore: number;
    feedback: string;
    isPassed: boolean;
    dataUrl: string;
  } | null>(null);

  // Score tracking for current session
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Filtered Question list
  const filteredQuestions = SPM_QUESTIONS.filter((q) => {
    if (selectedFilter === 'hot2026') return q.isHot2026;
    if (selectedFilter === 'bond_drawing') return q.questionType === 'drawing_bond';
    if (selectedFilter === 'form4') return q.chapterId.startsWith('f4_');
    if (selectedFilter === 'form5') return q.chapterId.startsWith('f5_');
    if (selectedFilter === 'all') return true;
    return q.chapterId === selectedFilter;
  });

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !currentQuestion || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + currentQuestion.marks * 10);
      setCorrectAnswersCount((prev) => prev + 1);
      onUpdateUserXP(currentQuestion.marks * 15);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setWrongAnswersCount((prev) => prev + 1);

      // Save directly to Correction Vault (Buku Pembetulan)
      addCorrectionItem({
        questionId: currentQuestion.id,
        studentId: user.id,
        chapterId: currentQuestion.chapterId,
        studentAnswer: selectedOption,
        correctAnswer: currentQuestion.correctAnswer,
        question: currentQuestion,
        notes: `Misconception on ${currentQuestion.hotTagText}`,
      });
    }
  };

  const handleDrawingEvaluatedInQuiz = (result: {
    score: number;
    maxScore: number;
    feedback: string;
    isPassed: boolean;
    dataUrl: string;
    strengths: string[];
    improvements: string[];
  }) => {
    if (!currentQuestion) return;
    setDrawingEvaluation(result);
    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    if (result.isPassed) {
      setScore((prev) => prev + currentQuestion.marks * 15);
      setCorrectAnswersCount((prev) => prev + 1);
      onUpdateUserXP(currentQuestion.marks * 25);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setWrongAnswersCount((prev) => prev + 1);

      // Save to correction vault with drawing data
      addCorrectionItem({
        questionId: currentQuestion.id,
        studentId: user.id,
        chapterId: currentQuestion.chapterId,
        studentAnswer: 'Incomplete Bond Drawing',
        correctAnswer: currentQuestion.correctAnswer,
        question: currentQuestion,
        notes: `Incomplete drawing for ${currentQuestion.drawingTargetFormula || currentQuestion.hotTagText}`,
        submittedDrawingUrl: result.dataUrl,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setDrawingEvaluation(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      // Complete quiz
      setIsQuizCompleted(true);
      recordQuizAttempt({
        studentId: user.id,
        chapterId: selectedFilter === 'bond_drawing' ? 'f4_c5' : selectedFilter,
        totalQuestions: filteredQuestions.length,
        score,
        correctCount: correctAnswersCount + (selectedOption === currentQuestion?.correctAnswer || drawingEvaluation?.isPassed ? 1 : 0),
        wrongCount: wrongAnswersCount + (!drawingEvaluation?.isPassed && selectedOption !== currentQuestion?.correctAnswer ? 1 : 0),
        timeSpentSeconds: 120,
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setDrawingEvaluation(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setScore(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Category Filter Pill Bar */}
      <div className="bg-white p-3.5 rounded-3xl border-2 border-indigo-50 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Quiz Question Bank Filter (Form 4 & Form 5 Unlocked)
          </span>
          <span className="text-[11px] text-emerald-600 font-bold hidden sm:inline">
            ✨ {filteredQuestions.length} Questions in current filter
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setSelectedFilter('hot2026');
              handleRestartQuiz();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedFilter === 'hot2026'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-100'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>🔥 SPM 2026 Hot List</span>
          </button>

          <button
            onClick={() => {
              setSelectedFilter('bond_drawing');
              handleRestartQuiz();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              selectedFilter === 'bond_drawing'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Pencil className="w-4 h-4 text-indigo-300" />
            <span>✏️ SPM Bond Drawings</span>
          </button>

          <button
            onClick={() => {
              setSelectedFilter('form4');
              handleRestartQuiz();
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              selectedFilter === 'form4'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📚 Form 4 (Tingkatan 4)
          </button>

          <button
            onClick={() => {
              setSelectedFilter('form5');
              handleRestartQuiz();
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              selectedFilter === 'form5'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🧪 Form 5 (Tingkatan 5)
          </button>

          <button
            onClick={() => {
              setSelectedFilter('all');
              handleRestartQuiz();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Questions (F4 + F5)
          </button>

          {SPM_CHAPTERS.map((chap) => (
            <button
              key={chap.id}
              onClick={() => {
                setSelectedFilter(chap.id);
                handleRestartQuiz();
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedFilter === chap.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border border-slate-200'
              }`}
            >
              <span>{chap.icon} </span>
              <span className="font-semibold">{chap.title}</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">(F{chap.form})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Screen or Completion Screen */}
      {!isQuizCompleted && currentQuestion ? (
        <div className="bg-white rounded-3xl border-2 border-indigo-50 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Top Progress & Meta Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 bg-orange-100 text-orange-800 text-xs font-black rounded-full border border-orange-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>{currentQuestion.hotTagText}</span>
              </span>

              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                {currentQuestion.paperType}
              </span>

              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {currentQuestion.difficulty}
              </span>

              {currentQuestion.questionType === 'drawing_bond' && (
                <span className="px-2.5 py-1 bg-pink-100 text-pink-800 text-xs font-black rounded-full flex items-center gap-1">
                  <Pencil className="w-3 h-3 text-pink-600" />
                  <span>Interactive Drawing Question</span>
                </span>
              )}
            </div>

            {/* Question Counter */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Question <strong className="text-indigo-700 font-black">{currentIndex + 1}</strong> of {filteredQuestions.length}
              </span>
              <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-indigo-900 leading-snug">
              {currentQuestion.questionText}
            </h3>
            {currentQuestion.questionTextBM && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
                {currentQuestion.questionTextBM}
              </p>
            )}
          </div>

          {/* QUESTION BODY: Interactive Bond Drawing Canvas OR Standard MCQ Options */}
          {currentQuestion.questionType === 'drawing_bond' ? (
            /* Dedicated Drawing In Quiz */
            <div className="pt-2">
              <BondDrawingCanvas
                targetFormula={currentQuestion.drawingTargetFormula || 'Chemical Bond Formation'}
                bondType={currentQuestion.drawingBondType || 'covalent'}
                expectedElements={currentQuestion.drawingExpectedElements}
                hint={currentQuestion.drawingHint}
                presetStamps={currentQuestion.drawingPresetStamps}
                onDrawingEvaluated={handleDrawingEvaluatedInQuiz}
              />
            </div>
          ) : (
            /* Standard MCQ Options List */
            <div className="space-y-3 pt-2">
              {currentQuestion.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;

                let optionStyle = 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-300';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-300';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 opacity-50 text-slate-500';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-300 shadow-xs';
                }

                const letters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition transform active:scale-99 cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition ${
                        isSelected || (isAnswerSubmitted && isCorrect)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {letters[idx]}
                    </span>
                    <span className="text-sm font-medium leading-relaxed pt-0.5">{opt}</span>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Submit / Check Answer Button (For MCQ questions) */}
          {currentQuestion.questionType !== 'drawing_bond' && !isAnswerSubmitted && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-200 transition transform hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Check Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Instant Feedback & Step-by-Step Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
              {(currentQuestion.questionType === 'drawing_bond'
                ? drawingEvaluation?.isPassed
                : selectedOption === currentQuestion.correctAnswer) ? (
                /* Correct Banner */
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
                      🎉
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-900">
                        {currentQuestion.questionType === 'drawing_bond'
                          ? `Bond Diagram Approved! +${currentQuestion.marks * 25} XP`
                          : `Correct! +${currentQuestion.marks * 15} XP`}
                      </h4>
                      <p className="text-xs text-emerald-700 font-medium">Spot on! You mastered this SPM target concept.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Wrong Banner - Direct routing to Correction Part */
                <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
                        🚨
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-orange-900">Added to Correction Box (Buku Pembetulan)!</h4>
                        <p className="text-xs text-orange-700 font-medium">
                          Don't worry! This question is recorded so you can review and master it during revision.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onNavigateToCorrections}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open Correction Box</span>
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step-by-Step Explanation & Mnemonic Card */}
              <div className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-orange-500" />
                    <span>SPM Examiner Step-by-Step Solution & Marking Scheme</span>
                  </h4>

                  {currentQuestion.relatedModel3DId && onNavigateTo3DModel && (
                    <button
                      onClick={() => onNavigateTo3DModel(currentQuestion.relatedModel3DId!)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>View in 3D 360°</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>

                {/* Step List */}
                <div className="space-y-1.5 pt-1">
                  {currentQuestion.stepByStepSolution?.map((step, i) => (
                    <div key={i} className="text-xs text-indigo-900 bg-white/90 p-2.5 rounded-xl border border-indigo-100 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Mnemonic & Trap */}
                {currentQuestion.keyMnemonic && (
                  <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-900 flex items-center gap-2">
                    <span>💡</span>
                    <span>{currentQuestion.keyMnemonic}</span>
                  </div>
                )}

                {/* Formula / Equation */}
                {currentQuestion.formulaOrEquation && (
                  <div className="p-2.5 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl flex items-center gap-2">
                    <span>🧪 Equation:</span>
                    <span>{currentQuestion.formulaOrEquation}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-white rounded-3xl border-2 border-indigo-50 shadow-sm p-8 text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-orange-200">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-indigo-950">SPM Drill Completed!</h2>
            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
              Great job practicing high-probability SPM 2026 exam questions and chemical bond drawings.
            </p>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-600 uppercase">Total Score</span>
              <p className="text-2xl font-black text-indigo-950 mt-1">{score} pts</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-600 uppercase">Correct / Passed</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">{correctAnswersCount}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <span className="text-xs font-bold text-orange-600 uppercase">Review In Vault</span>
              <p className="text-2xl font-black text-orange-950 mt-1">{wrongAnswersCount}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            {wrongAnswersCount > 0 && (
              <button
                onClick={onNavigateToCorrections}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-200 transition flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Correction Box ({wrongAnswersCount})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
