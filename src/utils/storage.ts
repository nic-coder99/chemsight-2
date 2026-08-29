import {
  UserProfile,
  UserAccount,
  CorrectionItem,
  QuizAttempt,
  DrawingSubmission,
  ClassroomRoom,
  RoomExercise,
  HomeworkSubmission,
} from '../types';
import {
  SPM_QUESTIONS,
  MOCK_STUDENTS,
  MOCK_ROOMS,
  MOCK_EXERCISES,
  MOCK_HOMEWORK_SUBMISSIONS,
} from '../data/chemistryData';

const USER_KEY = 'kimichemi_user';
const SESSION_KEY = 'kimichemi_auth_session';
const ACCOUNTS_KEY = 'kimichemi_accounts';
const CORRECTIONS_KEY = 'kimichemi_corrections';
const ATTEMPTS_KEY = 'kimichemi_attempts';
const DRAWINGS_KEY = 'kimichemi_drawings';
const ROSTER_KEY = 'kimichemi_roster';
const ROOMS_KEY = 'kimichemi_rooms';
const EXERCISES_KEY = 'kimichemi_exercises';
const HOMEWORK_KEY = 'kimichemi_homework';

// Seed initial default accounts (Students & Teachers)
export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 's_adam',
    email: 'adam@spm.edu.my',
    password: '123',
    name: 'Adam Zikri',
    role: 'student',
    age: 17,
    form: 'Form 5',
    avatar: 'atomie',
    school: 'SMK Seri Bintang',
    className: '5 Sains 1',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 's_siti',
    email: 'siti@spm.edu.my',
    password: '123',
    name: 'Siti Aisyah',
    role: 'student',
    age: 16,
    form: 'Form 4',
    avatar: 'beaker',
    school: 'SMK Seri Bintang',
    className: '4 Sains Murni',
    createdAt: '2026-01-15T09:30:00.000Z',
  },
  {
    id: 's_weijie',
    email: 'weijie@spm.edu.my',
    password: '123',
    name: 'Tan Wei Jie',
    role: 'student',
    age: 15,
    form: 'Form 4',
    avatar: 'ellie',
    school: 'SMJK Chung Hwa',
    className: '4 STEM A',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 't_noraini',
    email: 'noraini@smk.edu.my',
    password: '123',
    name: 'Cikgu Noraini binti Yusof',
    role: 'teacher',
    form: 'Teacher',
    avatar: 'beaker',
    school: 'SMK Seri Bintang',
    className: 'Head of Chemistry Dept',
    createdAt: '2025-11-20T08:00:00.000Z',
  },
];

export function getStoredAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load accounts', e);
  }

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
  return DEFAULT_ACCOUNTS;
}

export function saveAccounts(accounts: UserAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerAccount(accountData: Omit<UserAccount, 'id' | 'createdAt'>): {
  success: boolean;
  message: string;
  user?: UserProfile;
} {
  const accounts = getStoredAccounts();
  const normalizedEmail = accountData.email.trim().toLowerCase();

  // Check if email already exists
  if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
    return { success: false, message: `Email ${accountData.email} is already registered. Please log in instead.` };
  }

  const newId = (accountData.role === 'teacher' ? 't_' : 's_') + Date.now();
  const newAccount: UserAccount = {
    ...accountData,
    id: newId,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  const newProfile: UserProfile = {
    id: newId,
    name: newAccount.name,
    email: newAccount.email,
    age: newAccount.age,
    role: newAccount.role,
    avatar: newAccount.avatar,
    form: newAccount.form,
    school: newAccount.school || 'SMK Seri Bintang',
    className: newAccount.className || (newAccount.role === 'teacher' ? 'Head of Chemistry' : '5 Sains 1'),
    xp: newAccount.role === 'student' ? 100 : 500,
    streakDays: 1,
    lastActive: new Date().toISOString(),
    masteryPercentage: newAccount.role === 'student' ? 40 : 100,
  };

  saveUserProfile(newProfile);
  localStorage.setItem(SESSION_KEY, 'true');
  return { success: true, message: 'Account registered successfully!', user: newProfile };
}

export function loginAccount(
  identifier: string,
  password?: string,
  expectedRole?: 'student' | 'teacher'
): { success: boolean; message: string; user?: UserProfile } {
  const accounts = getStoredAccounts();
  const term = identifier.trim().toLowerCase();

  const matched = accounts.find((a) => {
    const matchesIdOrEmail = a.id.toLowerCase() === term || a.email.toLowerCase() === term || a.name.toLowerCase() === term;
    if (expectedRole && a.role !== expectedRole) return false;
    return matchesIdOrEmail;
  });

  if (!matched) {
    return {
      success: false,
      message: expectedRole
        ? `No ${expectedRole} account found matching "${identifier}". You can sign up a new account!`
        : `No account found matching "${identifier}". Please check your email or sign up.`,
    };
  }

  if (password && matched.password && matched.password !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  // Load or create profile
  const profile: UserProfile = {
    id: matched.id,
    name: matched.name,
    email: matched.email,
    age: matched.age,
    role: matched.role,
    avatar: matched.avatar,
    form: matched.form,
    school: matched.school || 'SMK Seri Bintang',
    className: matched.className || (matched.role === 'teacher' ? 'Head of Chemistry' : '5 Sains 1'),
    xp: matched.role === 'teacher' ? 2500 : 1450,
    streakDays: 6,
    lastActive: new Date().toISOString(),
    masteryPercentage: 82,
  };

  saveUserProfile(profile);
  localStorage.setItem(SESSION_KEY, 'true');
  return { success: true, message: `Welcome back, ${matched.name}!`, user: profile };
}

export function isUserLoggedIn(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to log out', e);
  }
}

export function getStoredUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user', e);
  }

  return null;
}

export function getFallbackUserProfile(): UserProfile {
  return {
    id: 's_adam',
    name: 'Adam Zikri',
    email: 'adam@spm.edu.my',
    age: 17,
    role: 'student',
    avatar: 'atomie',
    form: 'Form 5',
    school: 'SMK Seri Bintang',
    className: '5 Sains 1',
    xp: 1450,
    streakDays: 6,
    lastActive: new Date().toISOString(),
    masteryPercentage: 78,
  };
}

export function saveUserProfile(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Aliases for compatibility
export const getStoredUser = getStoredUserProfile;
export const saveStoredUser = saveUserProfile;

export function getStoredCorrections(studentId?: string): CorrectionItem[] {
  try {
    const raw = localStorage.getItem(CORRECTIONS_KEY);
    if (raw) {
      const all: CorrectionItem[] = JSON.parse(raw);
      if (studentId) return all.filter((c) => c.studentId === studentId);
      return all;
    }
  } catch (e) {
    console.error('Failed to load corrections', e);
  }

  // Seed default correction item for Adam so the mistake vault is demonstrably active
  const seedItem: CorrectionItem = {
    id: 'corr_seed_1',
    questionId: 'q_redox_01',
    studentId: 's_adam',
    chapterId: 'f5_c1',
    studentAnswer: 1, // Wrong choice
    correctAnswer: 0,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    question: SPM_QUESTIONS[1] || SPM_QUESTIONS[0],
    isResolved: false,
    attemptsCount: 1,
    notes: 'Remember E° value rule: More negative = Anode (Oxidation)!',
  };

  const initial = [seedItem];
  localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(initial));
  if (studentId) return initial.filter((c) => c.studentId === studentId);
  return initial;
}

export function addCorrectionItem(item: Omit<CorrectionItem, 'id' | 'timestamp' | 'isResolved' | 'attemptsCount'>) {
  const current = getStoredCorrections();
  const existingIndex = current.findIndex(
    (c) => c.studentId === item.studentId && c.questionId === item.questionId && !c.isResolved
  );

  if (existingIndex >= 0) {
    current[existingIndex].attemptsCount += 1;
    current[existingIndex].studentAnswer = item.studentAnswer;
    current[existingIndex].timestamp = new Date().toISOString();
  } else {
    const newItem: CorrectionItem = {
      ...item,
      id: 'corr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      isResolved: false,
      attemptsCount: 1,
    };
    current.unshift(newItem);
  }

  localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(current));
}

export function resolveCorrectionItem(id: string) {
  const current = getStoredCorrections();
  const updated = current.map((c) => (c.id === id ? { ...c, isResolved: true } : c));
  localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(updated));
}

export function getStoredQuizAttempts(studentId?: string): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (raw) {
      const all: QuizAttempt[] = JSON.parse(raw);
      if (studentId) return all.filter((a) => a.studentId === studentId);
      return all;
    }
  } catch (e) {
    console.error('Failed to load quiz attempts', e);
  }
  return [];
}

export function recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) {
  const current = getStoredQuizAttempts();
  const newAttempt: QuizAttempt = {
    ...attempt,
    id: 'attempt_' + Date.now(),
    timestamp: new Date().toISOString(),
  };
  current.unshift(newAttempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(current));
  return newAttempt;
}

export function getStoredDrawings(studentId?: string): DrawingSubmission[] {
  try {
    const raw = localStorage.getItem(DRAWINGS_KEY);
    if (raw) {
      const all: DrawingSubmission[] = JSON.parse(raw);
      if (studentId) return all.filter((d) => d.studentId === studentId);
      return all;
    }
  } catch (e) {
    console.error('Failed to load drawings', e);
  }

  // Seed sample drawing submission
  const seedDraw: DrawingSubmission = {
    id: 'draw_seed_1',
    challengeId: 'draw_mg_atom',
    studentId: 's_adam',
    studentName: 'Adam Zikri',
    studentAvatar: 'atomie',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="white"/><circle cx="200" cy="150" r="25" fill="%23ec4899"/><text x="200" y="155" font-family="sans-serif" font-size="12" fill="white" font-weight="bold" text-anchor="middle">12p 12n</text><circle cx="200" cy="150" r="50" fill="none" stroke="%2394a3b8" stroke-dasharray="4"/><circle cx="200" cy="150" r="80" fill="none" stroke="%2394a3b8" stroke-dasharray="4"/><circle cx="200" cy="150" r="110" fill="none" stroke="%2394a3b8" stroke-dasharray="4"/><circle cx="200" cy="100" r="5" fill="%232563eb"/><circle cx="200" cy="200" r="5" fill="%232563eb"/><circle cx="200" cy="40" r="5" fill="%232563eb"/><circle cx="200" cy="260" r="5" fill="%232563eb"/></svg>',
    score: 92,
    isPassed: true,
    feedback: 'Accurate electron configuration of 2.8.2 with clear nucleus labels!',
    strengths: ['Correct 3 electron shells', '2 valence electrons clearly drawn'],
    improvements: ['Ensure valence electrons are paired properly according to SPM convention'],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    teacherSticker: '⭐ Chemist of the Week!',
    teacherComment: 'Very neat diagram Adam! Keep this accuracy for SPM Paper 2 Section B.',
  };

  const initialDrawings = [seedDraw];
  localStorage.setItem(DRAWINGS_KEY, JSON.stringify(initialDrawings));
  if (studentId) return initialDrawings.filter((d) => d.studentId === studentId);
  return initialDrawings;
}

export function saveDrawingSubmission(sub: Omit<DrawingSubmission, 'id' | 'timestamp'>) {
  const current = getStoredDrawings();
  const newSub: DrawingSubmission = {
    ...sub,
    id: 'draw_' + Date.now(),
    timestamp: new Date().toISOString(),
  };
  current.unshift(newSub);
  localStorage.setItem(DRAWINGS_KEY, JSON.stringify(current));
  return newSub;
}

export function addTeacherRemarkToDrawing(drawingId: string, sticker: string, comment: string) {
  const current = getStoredDrawings();
  const updated = current.map((d) =>
    d.id === drawingId ? { ...d, teacherSticker: sticker, teacherComment: comment } : d
  );
  localStorage.setItem(DRAWINGS_KEY, JSON.stringify(updated));
}

export function getRosterData() {
  return MOCK_STUDENTS;
}

// ----------------- CLASSROOM ROOMS MANAGEMENT -----------------

export function getStoredRooms(): ClassroomRoom[] {
  try {
    const raw = localStorage.getItem(ROOMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load rooms', e);
  }

  localStorage.setItem(ROOMS_KEY, JSON.stringify(MOCK_ROOMS));
  return MOCK_ROOMS;
}

export function saveStoredRooms(rooms: ClassroomRoom[]) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

// Returns rooms relevant ONLY to the current user (Isolation)
export function getRoomsForUser(user: UserProfile): ClassroomRoom[] {
  const allRooms = getStoredRooms();
  if (user.role === 'teacher') {
    // Teachers see rooms they created or rooms matching their school / teacher ID
    return allRooms.filter(
      (r) => r.teacherId === user.id || (user.school && r.school.toLowerCase() === user.school.toLowerCase())
    );
  } else {
    // Students see rooms they are enrolled in
    return allRooms.filter((r) => r.studentIds.includes(user.id));
  }
}

export function createClassroomRoom(
  data: Omit<ClassroomRoom, 'id' | 'code' | 'createdAt' | 'studentIds'>
): ClassroomRoom {
  const current = getStoredRooms();
  // Generate distinct code like CHEM-789
  const randomNum = Math.floor(100 + Math.random() * 900);
  const code = `CHEM-${randomNum}`;

  const newRoom: ClassroomRoom = {
    ...data,
    id: 'room_' + Date.now(),
    code,
    createdAt: new Date().toISOString(),
    studentIds: [],
    bannerColor: 'from-indigo-600 to-blue-700',
  };

  current.unshift(newRoom);
  saveStoredRooms(current);
  return newRoom;
}

export function joinClassroomByCode(
  roomCode: string,
  studentId: string
): { success: boolean; message: string; room?: ClassroomRoom } {
  const current = getStoredRooms();
  const normalized = roomCode.trim().toUpperCase();
  const targetRoom = current.find((r) => r.code.toUpperCase() === normalized);

  if (!targetRoom) {
    return { success: false, message: `Room with code "${roomCode}" not found. Please verify with your teacher.` };
  }

  if (targetRoom.studentIds.includes(studentId)) {
    return { success: true, message: `You are already enrolled in ${targetRoom.name}!`, room: targetRoom };
  }

  targetRoom.studentIds.push(studentId);
  saveStoredRooms(current);
  return { success: true, message: `Successfully joined ${targetRoom.name} (${targetRoom.school})!`, room: targetRoom };
}

// ----------------- EXERCISES MANAGEMENT -----------------

export function getStoredExercises(roomId?: string): RoomExercise[] {
  try {
    const raw = localStorage.getItem(EXERCISES_KEY);
    let exercises: RoomExercise[] = raw ? JSON.parse(raw) : MOCK_EXERCISES;
    if (!raw) {
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(MOCK_EXERCISES));
    }
    if (roomId) return exercises.filter((e) => e.roomId === roomId);
    return exercises;
  } catch (e) {
    console.error('Failed to load exercises', e);
  }
  return MOCK_EXERCISES;
}

export function createRoomExercise(
  exercise: Omit<RoomExercise, 'id' | 'createdAt'>
): RoomExercise {
  const current = getStoredExercises();
  const newEx: RoomExercise = {
    ...exercise,
    id: 'ex_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  current.unshift(newEx);
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(current));
  return newEx;
}

// ----------------- HOMEWORK SUBMISSIONS MANAGEMENT -----------------

export function getStoredHomeworkSubmissions(
  roomId?: string,
  exerciseId?: string,
  studentId?: string
): HomeworkSubmission[] {
  try {
    const raw = localStorage.getItem(HOMEWORK_KEY);
    let subs: HomeworkSubmission[] = raw ? JSON.parse(raw) : MOCK_HOMEWORK_SUBMISSIONS;
    if (!raw) {
      localStorage.setItem(HOMEWORK_KEY, JSON.stringify(MOCK_HOMEWORK_SUBMISSIONS));
    }

    if (roomId) {
      subs = subs.filter((s) => s.roomId === roomId);
    }
    if (exerciseId) {
      subs = subs.filter((s) => s.exerciseId === exerciseId);
    }
    if (studentId) {
      subs = subs.filter((s) => s.studentId === studentId);
    }
    return subs;
  } catch (e) {
    console.error('Failed to load homework submissions', e);
  }
  return MOCK_HOMEWORK_SUBMISSIONS;
}

export function submitHomework(
  submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>
): HomeworkSubmission {
  const current = getStoredHomeworkSubmissions();
  // If student already submitted for this exercise, update it
  const existingIdx = current.findIndex(
    (s) => s.exerciseId === submission.exerciseId && s.studentId === submission.studentId
  );

  const newSub: HomeworkSubmission = {
    ...submission,
    id: existingIdx >= 0 ? current[existingIdx].id : 'sub_' + Date.now(),
    submittedAt: new Date().toISOString(),
    status: 'submitted',
  };

  if (existingIdx >= 0) {
    current[existingIdx] = newSub;
  } else {
    current.unshift(newSub);
  }

  localStorage.setItem(HOMEWORK_KEY, JSON.stringify(current));
  return newSub;
}

export function gradeHomeworkSubmission(
  submissionId: string,
  score: number,
  feedback: string,
  sticker?: string
) {
  const current = getStoredHomeworkSubmissions();
  const updated = current.map((s) =>
    s.id === submissionId
      ? {
          ...s,
          score,
          teacherFeedback: feedback,
          teacherSticker: sticker || s.teacherSticker,
          status: 'graded' as const,
          gradedAt: new Date().toISOString(),
        }
      : s
  );
  localStorage.setItem(HOMEWORK_KEY, JSON.stringify(updated));
}

// Strictly isolates students visible to a teacher (Only students in teacher's school/rooms)
export function getStudentsForTeacher(teacher: UserProfile) {
  const teacherRooms = getRoomsForUser(teacher);
  const enrolledStudentIds = new Set<string>();
  teacherRooms.forEach((r) => r.studentIds.forEach((sid) => enrolledStudentIds.add(sid)));

  const allStudents = getRosterData();
  // Return only students in the teacher's rooms
  return allStudents.filter((s) => enrolledStudentIds.has(s.id));
}

