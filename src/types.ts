export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age?: number;
  role: UserRole;
  avatar: string; // Avatar identifier or emoji
  form: 'Form 4' | 'Form 5' | 'Teacher';
  school?: string;
  className?: string;
  xp: number;
  streakDays: number;
  lastActive: string;
  masteryPercentage: number;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  age?: number;
  form: 'Form 4' | 'Form 5' | 'Teacher';
  avatar: string;
  school?: string;
  className?: string;
  createdAt: string;
}

export type SPMChapterId =
  | 'f4_c2' // Matter & Atomic Structure
  | 'f4_c3' // Chemical Formulae & Equations
  | 'f4_c4' // Periodic Table of Elements
  | 'f4_c5' // Chemical Bond
  | 'f4_c6' // Acid, Base and Salt
  | 'f4_c7' // Rate of Reaction
  | 'f5_c1' // Redox Equilibrium
  | 'f5_c2' // Carbon Compound
  | 'f5_c3' // Thermochemistry
  | 'f5_c4' // Polymer Chemistry
  | 'f5_c5'; // Consumer & Industrial Chemistry

export interface SPMChapter {
  id: SPMChapterId;
  title: string;
  titleBM: string;
  form: 4 | 5;
  icon: string;
  hotProbability: number; // 0-100%
  hotReason: string;
  color: string;
  totalQuestions: number;
}

export type QuestionType = 'mcq' | 'drawing_bond' | 'drawing_apparatus' | 'structured' | 'calculation';

export interface Question {
  id: string;
  chapterId: SPMChapterId;
  paperType: 'Paper 1 (MCQ)' | 'Paper 2 (Structured)' | 'Paper 3 (Practical)';
  questionType?: QuestionType;
  isHot2026: boolean;
  hotRating: number; // e.g. 98 (%)
  hotTagText: string;
  questionText: string;
  questionTextBM?: string;
  diagramUrl?: string;
  options?: string[]; // for MCQ
  correctAnswer: string | number; // index or text or formula
  explanation: string;
  stepByStepSolution: string[];
  keyMnemonic?: string;
  commonMistakes: string;
  formulaOrEquation?: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'KBAT (HOTS)';
  relatedModel3DId?: string;
  // Dedicated Bond / Diagram Drawing in Quiz
  drawingBondType?: 'covalent' | 'ionic' | 'coordinate_dative' | 'hydrogen';
  drawingTargetFormula?: string;
  drawingExpectedElements?: string[];
  drawingHint?: string;
  drawingPresetStamps?: string[];
  drawingSampleAnswerUrl?: string;
}

export interface CorrectionItem {
  id: string;
  questionId: string;
  studentId: string;
  chapterId: SPMChapterId;
  studentAnswer: string | number;
  correctAnswer: string | number;
  timestamp: string;
  question: Question;
  isResolved: boolean; // marked true when student successfully retries
  attemptsCount: number;
  notes?: string;
  submittedDrawingUrl?: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  timestamp: string;
  chapterId?: SPMChapterId | 'all' | 'hot2026' | 'form4' | 'form5';
  totalQuestions: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
}

export interface DrawingChallenge {
  id: string;
  title: string;
  chapterId: SPMChapterId;
  category: 'atomic_structure' | 'experiment_apparatus' | 'molecular_bonding';
  isHotSPM: boolean;
  prompt: string;
  promptBM: string;
  standardSolutionDescription: string;
  expectedElements: string[];
  hint: string;
  defaultApparatusStamps: string[];
  sampleReferenceUrl?: string;
  guideSteps: string[];
}

export interface DrawingSubmission {
  id: string;
  challengeId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  timestamp: string;
  dataUrl: string;
  score: number;
  isPassed: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
  teacherSticker?: string;
  teacherComment?: string;
}

export interface Model3DData {
  id: string;
  name: string;
  category: 'molecule' | 'crystal' | 'apparatus' | 'atom';
  formula: string;
  chapterId: SPMChapterId;
  description: string;
  geometryType: 'tetrahedral' | 'bent' | 'linear' | 'pyramidal' | 'crystal_lattice' | 'distillation' | 'titration' | 'voltaic_cell' | 'bohr_atom' | 'ethanol';
  bondAngle?: string;
  hybridization?: string;
  funFact: string;
}

export interface QualitativeTestItem {
  ion: string;
  type: 'cation' | 'anion';
  reagentNaOH: string;
  reagentNH3: string;
  confirmatoryTest: string;
  mnemonic: string;
  colorHex: string;
}

// Classroom & Study Room Systems
export interface ClassroomRoom {
  id: string;
  code: string; // e.g. "CHEM-501", "STB-8821"
  name: string; // e.g. "5 Sains 1 (Chemistry 2026)"
  school: string; // e.g. "SMK Seri Bintang"
  teacherId: string;
  teacherName: string;
  subject: string; // "SPM Chemistry"
  form: 'Form 4' | 'Form 5';
  studentIds: string[]; // List of enrolled student IDs
  createdAt: string;
  description?: string;
  announcement?: string;
  bannerColor?: string;
}

export type ExerciseType = 'bond_drawing' | 'quiz_drill' | 'past_year_structured' | 'practical_apparatus';

export interface RoomExercise {
  id: string;
  roomId: string;
  teacherId: string;
  title: string;
  chapterId: SPMChapterId;
  description: string;
  dueDate: string;
  type: ExerciseType;
  targetBondFormula?: string;
  totalPoints: number;
  createdAt: string;
  instructions?: string[];
  attachedQuestionIds?: string[];
}

export interface HomeworkSubmission {
  id: string;
  exerciseId: string;
  roomId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  school: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'revision_needed';
  drawingDataUrl?: string;
  studentNotes?: string;
  score?: number; // e.g. 95
  maxScore: number;
  teacherFeedback?: string;
  teacherSticker?: string;
  gradedAt?: string;
  studentForm?: string;
}

export interface MacroWeakTopic {
  id: string;
  chapterId: SPMChapterId;
  chapterTitle: string;
  topicName: string;
  nationalAverageAccuracy: number; // e.g. 41%
  topMistakeReason: string;
  spmExamWeight: string;
  hotPrediction2026: boolean;
  sampleQuestionTitle: string;
  commonTraps: string[];
  keyFixStrategy: string;
}
