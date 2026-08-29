import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  DrawingSubmission,
  CorrectionItem,
  ClassroomRoom,
  RoomExercise,
  HomeworkSubmission,
  SPMChapterId,
} from '../types';
import {
  SPM_CHAPTERS,
  MOCK_STUDENTS,
  MACRO_WEAK_TOPICS,
} from '../data/chemistryData';
import {
  getStoredDrawings,
  getStoredCorrections,
  addTeacherRemarkToDrawing,
  getRoomsForUser,
  createClassroomRoom,
  getStoredExercises,
  createRoomExercise,
  getStoredHomeworkSubmissions,
  gradeHomeworkSubmission,
  getStudentsForTeacher,
} from '../utils/storage';
import {
  Users,
  AlertTriangle,
  Award,
  CheckCircle2,
  BookOpen,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Flame,
  Search,
  MessageSquare,
  Star,
  Eye,
  GraduationCap,
  Lock,
  PlusCircle,
  KeyRound,
  FileText,
  Upload,
  Copy,
  Check,
  BarChart3,
  Layers,
  Clock,
  Pencil,
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: UserProfile;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher }) => {
  // Tabs: 'rooms_homework' | 'students_roster' | 'macro_analytics' | 'drawings_feed'
  const [activeTab, setActiveTab] = useState<'rooms_homework' | 'students_roster' | 'macro_analytics' | 'drawings_feed'>('rooms_homework');

  // Rooms State
  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [exercises, setExercises] = useState<RoomExercise[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);

  // Students & Drawings & Corrections State
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s_adam');
  const [drawings, setDrawings] = useState<DrawingSubmission[]>([]);
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);

  // Modals State
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState('SPM Chemistry Form 5');
  const [newRoomForm, setNewRoomForm] = useState<'Form 4' | 'Form 5'>('Form 5');
  const [newRoomAnnouncement, setNewRoomAnnouncement] = useState('');

  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = useState(false);
  const [newExTitle, setNewExTitle] = useState('');
  const [newExChapter, setNewExChapter] = useState<SPMChapterId>('f4_c5');
  const [newExType, setNewExType] = useState<'bond_drawing' | 'quiz_drill' | 'past_year_structured' | 'practical_apparatus'>('bond_drawing');
  const [newExFormula, setNewExFormula] = useState('NH₄⁺ (Ammonium ion)');
  const [newExDesc, setNewExDesc] = useState('');
  const [newExPoints, setNewExPoints] = useState(100);

  // Homework Grading Modal
  const [gradingSubmission, setGradingSubmission] = useState<HomeworkSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [gradeFeedback, setGradeFeedback] = useState('Excellent work! Clear electron configuration and neat labels.');
  const [gradeSticker, setGradeSticker] = useState('⭐ Excellent Standard!');
  const [gradeSuccessToast, setGradeSuccessToast] = useState(false);

  // Drawing Remark Modal
  const [selectedDrawingForRemark, setSelectedDrawingForRemark] = useState<DrawingSubmission | null>(null);
  const [remarkSticker, setRemarkSticker] = useState('⭐ Excellent Standard!');
  const [remarkComment, setRemarkComment] = useState('Neat apparatus arrangement! Keep up the great work in SPM preparation.');
  const [feedbackSuccessToast, setFeedbackSuccessToast] = useState(false);

  const [copiedRoomCode, setCopiedRoomCode] = useState<string | null>(null);

  // Initial Data Load
  const refreshAllData = () => {
    const userRooms = getRoomsForUser(teacher);
    setRooms(userRooms);
    if (userRooms.length > 0 && (!selectedRoomId || !userRooms.find((r) => r.id === selectedRoomId))) {
      setSelectedRoomId(userRooms[0].id);
    }

    const teacherStudents = getStudentsForTeacher(teacher);
    setStudents(teacherStudents.length > 0 ? teacherStudents : MOCK_STUDENTS);
    if (teacherStudents.length > 0) {
      setSelectedStudentId(teacherStudents[0].id);
    }

    setDrawings(getStoredDrawings());
    setCorrections(getStoredCorrections());
  };

  useEffect(() => {
    refreshAllData();
  }, [teacher.id]);

  useEffect(() => {
    if (selectedRoomId) {
      setExercises(getStoredExercises(selectedRoomId));
      setSubmissions(getStoredHomeworkSubmissions(selectedRoomId));
    }
  }, [selectedRoomId]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0] || MOCK_STUDENTS[0];
  const studentCorrections = corrections.filter((c) => c.studentId === selectedStudentId);
  const studentDrawings = drawings.filter((d) => d.studentId === selectedStudentId);

  // Handle Room Creation
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    createClassroomRoom({
      name: newRoomName.trim(),
      school: teacher.school || 'SMK Seri Bintang',
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: newRoomSubject,
      form: newRoomForm,
      announcement: newRoomAnnouncement.trim() || undefined,
    });

    setNewRoomName('');
    setNewRoomAnnouncement('');
    setIsCreateRoomOpen(false);
    refreshAllData();
  };

  // Handle Exercise Creation
  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExTitle.trim() || !selectedRoomId) return;

    createRoomExercise({
      roomId: selectedRoomId,
      teacherId: teacher.id,
      title: newExTitle.trim(),
      chapterId: newExChapter,
      type: newExType,
      targetBondFormula: newExType === 'bond_drawing' ? newExFormula.trim() : undefined,
      description: newExDesc.trim() || 'Please complete and submit by the due date.',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      totalPoints: Number(newExPoints) || 100,
    });

    setNewExTitle('');
    setNewExDesc('');
    setIsCreateExerciseOpen(false);
    setExercises(getStoredExercises(selectedRoomId));
  };

  // Handle Homework Grading
  const handleGradeSubmission = () => {
    if (!gradingSubmission) return;

    gradeHomeworkSubmission(gradingSubmission.id, gradeScore, gradeFeedback, gradeSticker);
    setGradeSuccessToast(true);

    setTimeout(() => {
      setGradeSuccessToast(false);
      setGradingSubmission(null);
      if (selectedRoomId) {
        setSubmissions(getStoredHomeworkSubmissions(selectedRoomId));
      }
    }, 1200);
  };

  // Handle Drawing Remark
  const handleSendTeacherRemark = () => {
    if (!selectedDrawingForRemark) return;
    addTeacherRemarkToDrawing(selectedDrawingForRemark.id, remarkSticker, remarkComment);
    setDrawings(getStoredDrawings());
    setFeedbackSuccessToast(true);
    setTimeout(() => {
      setFeedbackSuccessToast(false);
      setSelectedDrawingForRemark(null);
    }, 1200);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedRoomCode(code);
    setTimeout(() => setCopiedRoomCode(null), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Banner with School Isolation Indicator */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-200" />
              <span>Teacher Portal</span>
            </span>

            <span className="px-3 py-1 bg-emerald-400 text-slate-950 text-xs font-black rounded-full flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{teacher.school || 'SMK Seri Bintang'} (Data Isolated)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {teacher.name} 👩‍🏫
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-xl">
            Monitor your school's classes, assign bond drawing & quiz homework, grade student submissions, and examine macro SPM national weak topics.
          </p>
        </div>

        {/* Action Buttons: Create Room & Assign Exercise */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCreateRoomOpen(true)}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-black text-xs rounded-2xl backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Create New Room</span>
          </button>

          <button
            onClick={() => setIsCreateExerciseOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-950" />
            <span>Assign Homework</span>
          </button>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-3xl border-2 border-indigo-50 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('rooms_homework')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rooms_homework'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Classrooms & Homework Inbox</span>
          {submissions.filter((s) => s.status === 'submitted').length > 0 && (
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
              {submissions.filter((s) => s.status === 'submitted').length} pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students_roster')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'students_roster'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Student Progress & Mistake Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('macro_analytics')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'macro_analytics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-orange-400" />
          <span>National SPM Weak Topics Analytics</span>
          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-black rounded-full">
            Macro
          </span>
        </button>

        <button
          onClick={() => setActiveTab('drawings_feed')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'drawings_feed'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Lab Drawings & Stickers</span>
        </button>
      </div>

      {/* ----------------- TAB 1: ROOMS & HOMEWORK INBOX ----------------- */}
      {activeTab === 'rooms_homework' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Room Selector Bar */}
          <div className="bg-white p-4 rounded-3xl border-2 border-indigo-50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2">
                Your Rooms:
              </span>
              {rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap border-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    <span>🏫 {room.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {room.code}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedRoom && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyCode(selectedRoom.code)}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-xl border border-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedRoomCode === selectedRoom.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Code!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Share Code: <strong>{selectedRoom.code}</strong></span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {selectedRoom && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Active Room Info & Assigned Exercises */}
              <div className="lg:col-span-5 space-y-6">
                {/* Room Summary Card */}
                <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-indigo-950">{selectedRoom.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{selectedRoom.school} • {selectedRoom.form}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-mono font-black rounded-xl">
                      {selectedRoom.code}
                    </span>
                  </div>

                  {selectedRoom.announcement && (
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                      <strong>📢 Announcement:</strong> {selectedRoom.announcement}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Enrolled Students:</span>
                    <span className="font-black text-indigo-900">{selectedRoom.studentIds.length} Students</span>
                  </div>
                </div>

                {/* Assigned Exercises for this Room */}
                <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Assigned Exercises ({exercises.length})</span>
                    </h4>
                    <button
                      onClick={() => setIsCreateExerciseOpen(true)}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>New</span>
                    </button>
                  </div>

                  {exercises.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 text-center font-medium">
                      No exercises created yet for this room.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {exercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full uppercase">
                              {ex.type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Due: {ex.dueDate}
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-slate-900">{ex.title}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{ex.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Homework Submissions Grading Inbox */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        <span>Homework Submissions Inbox ({submissions.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Review student work, examine their drawings, and award marks with encouraging stickers.
                      </p>
                    </div>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="p-8 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium">
                      No homework submitted yet for this classroom.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((sub) => {
                        const relatedExercise = exercises.find((e) => e.id === sub.exerciseId);

                        return (
                          <div
                            key={sub.id}
                            className={`p-5 rounded-3xl border-2 transition space-y-3 ${
                              sub.status === 'graded'
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-amber-50/50 border-amber-300 shadow-xs'
                            }`}
                          >
                            {/* Submission Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-lg font-black">
                                  {sub.studentAvatar === 'atomie' ? '⚛️' : sub.studentAvatar === 'beaker' ? '🧪' : sub.studentAvatar === 'ellie' ? '⚡' : '🫧'}
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-slate-900">{sub.studentName}</h4>
                                  <p className="text-[10px] font-bold text-slate-500">
                                    {sub.school} • Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {sub.status === 'graded' ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Graded: {sub.score}/{sub.maxScore}</span>
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-amber-200 text-amber-950 text-xs font-black rounded-full animate-pulse flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Needs Grading</span>
                                </span>
                              )}
                            </div>

                            {/* Related Exercise Title */}
                            <div className="p-2.5 bg-white/90 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                              <span className="text-slate-400 mr-1.5 font-normal">Assignment:</span>
                              <span>{relatedExercise?.title || 'Chemistry Homework'}</span>
                            </div>

                            {/* Student Submitted Drawing Preview */}
                            {sub.drawingDataUrl && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase">
                                  Student's Submitted Diagram:
                                </span>
                                <div className="h-40 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                                  <img
                                    src={sub.drawingDataUrl}
                                    alt="Submitted Drawing"
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Student's Notes */}
                            {sub.studentNotes && (
                              <p className="text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-slate-200">
                                <strong>Student Note:</strong> {sub.studentNotes}
                              </p>
                            )}

                            {/* Graded Details */}
                            {sub.status === 'graded' && (
                              <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs space-y-1">
                                <div className="flex items-center justify-between font-black text-emerald-950">
                                  <span>Teacher Feedback:</span>
                                  {sub.teacherSticker && <span>{sub.teacherSticker}</span>}
                                </div>
                                <p className="text-emerald-900">{sub.teacherFeedback}</p>
                              </div>
                            )}

                            {/* Grade Action Button */}
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => {
                                  setGradingSubmission(sub);
                                  setGradeScore(sub.score || 95);
                                  setGradeFeedback(sub.teacherFeedback || 'Excellent work! Keep this standard for SPM Paper 2.');
                                  setGradeSticker(sub.teacherSticker || '⭐ Excellent Standard!');
                                }}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>{sub.status === 'graded' ? 'Edit Mark & Feedback' : 'Grade Submission'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 2: STUDENTS ROSTER & MISTAKE VAULT ----------------- */}
      {activeTab === 'students_roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left: Student Roster List */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-2 border-indigo-50 shadow-sm space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Your Students ({students.length})
              </h3>
              <span className="text-[10px] font-bold text-indigo-600">Select to inspect</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {students.map((student) => {
                const isSelected = selectedStudentId === student.id;

                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl font-bold">
                        {student.avatar === 'atomie' ? '⚛️' : student.avatar === 'beaker' ? '🧪' : student.avatar === 'ellie' ? '⚡' : '🫧'}
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-slate-800">{student.name}</h4>
                        <p className="text-[11px] font-medium text-slate-500">{student.className} • {student.xp} XP</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-indigo-700">{student.masteryPercentage}%</span>
                      <p className="text-[10px] font-bold text-rose-500">{student.totalMistakes} mistakes</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Student Deep-Dive */}
          <div className="lg:col-span-8 space-y-6">
            {/* Student Profile Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-3xl bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-3xl shadow-sm">
                  {selectedStudent.avatar === 'atomie' ? '⚛️' : selectedStudent.avatar === 'beaker' ? '🧪' : selectedStudent.avatar === 'ellie' ? '⚡' : '🫧'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-indigo-900">{selectedStudent.name}</h3>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                      {selectedStudent.form}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Class: {selectedStudent.className} • Active: {selectedStudent.lastActive}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs font-black text-slate-800">{selectedStudent.solvedQuizzes}</span>
                  <p className="text-[10px] font-bold text-slate-400">Quizzes</p>
                </div>

                <div className="bg-orange-50 px-3 py-2 rounded-2xl border border-orange-200 text-center">
                  <span className="text-xs font-black text-orange-700">{selectedStudent.drawingScore}%</span>
                  <p className="text-[10px] font-bold text-orange-800">Drawing Avg</p>
                </div>
              </div>
            </div>

            {/* Student's Correction Vault Items (Buku Pembetulan) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Student's Unresolved Mistakes (Correction Vault)</span>
                </h4>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {studentCorrections.length} recorded
                </span>
              </div>

              {studentCorrections.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold text-center">
                  ⭐ No unresolved mistakes for {selectedStudent.name}!
                </div>
              ) : (
                <div className="space-y-3">
                  {studentCorrections.map((corr) => (
                    <div
                      key={corr.id}
                      className="p-4 bg-rose-50/50 border-2 border-rose-200 rounded-2xl text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-rose-900">{corr.question.questionText}</span>
                        <span className="px-2 py-0.5 bg-rose-200 text-rose-800 font-bold rounded-md text-[10px]">
                          Failed {corr.attemptsCount}x
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Student Misconception:</strong> {corr.question.commonMistakes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: NATIONAL & MACRO SPM WEAK TOPICS ----------------- */}
      {activeTab === 'macro_analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>National SPM Macro Weak Topics & Exam Pitfalls Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Aggregated nationwide diagnostic data identifying the hardest chemistry concepts that students struggle with, along with examiner guidance.
                </p>
              </div>

              <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 font-black text-xs rounded-xl self-start sm:self-auto">
                🚨 SPM 2026 High Priority Target
              </span>
            </div>
          </div>

          {/* Macro Weak Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MACRO_WEAK_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4 hover:border-indigo-200 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black rounded-full uppercase">
                      {topic.chapterTitle}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {topic.topicName}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-rose-600">
                      {topic.nationalAverageAccuracy}%
                    </span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">National Avg</p>
                  </div>
                </div>

                {/* Progress Accuracy Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        topic.nationalAverageAccuracy < 45
                          ? 'bg-rose-500'
                          : topic.nationalAverageAccuracy < 55
                          ? 'bg-orange-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${topic.nationalAverageAccuracy}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Low Mastery</span>
                    <span>Exam Weight: {topic.spmExamWeight}</span>
                  </div>
                </div>

                {/* Root Cause Misconception */}
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1">
                  <span className="text-[11px] font-black text-rose-950 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Top Student Misconception / Trap:</span>
                  </span>
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    {topic.topMistakeReason}
                  </p>
                </div>

                {/* Common Traps List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black text-slate-700 uppercase">
                    SPM Marking Scheme Common Traps:
                  </span>
                  <ul className="space-y-1">
                    {topic.commonTraps.map((trap, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-rose-500 font-black">✕</span>
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Fix Strategy */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-black text-emerald-950">Teacher Tip & Mnemonic: </strong>
                    <span>{topic.keyFixStrategy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 4: DRAWING SUBMISSIONS FEED ----------------- */}
      {activeTab === 'drawings_feed' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-indigo-950">
                Interactive Drawing Lab Submissions ({drawings.length})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Review diagrams drawn by students in the interactive lab and send reward stickers.
              </p>
            </div>
          </div>

          {drawings.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium">
              No lab drawing submissions yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {drawings.map((draw) => (
                <div
                  key={draw.id}
                  className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 hover:border-indigo-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">{draw.studentName}</span>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-lg">
                      {draw.score}%
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-video flex items-center justify-center">
                    <img
                      src={draw.dataUrl}
                      alt="Student Drawing"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-slate-800">{draw.challengeId}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{draw.feedback}</p>
                  </div>

                  {draw.teacherSticker && (
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl text-[11px] font-bold text-orange-900">
                      Teacher Remark: {draw.teacherSticker}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedDrawingForRemark(draw)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Encouragement Sticker</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- CREATE ROOM MODAL ----------------- */}
      {isCreateRoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-indigo-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-indigo-900">Create New Classroom Room</h3>
              <button
                onClick={() => setIsCreateRoomOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Classroom Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Sains 2 (Chemistry 2026)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Form Level:</label>
                  <select
                    value={newRoomForm}
                    onChange={(e) => setNewRoomForm(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Form 5">Form 5</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">School (Isolated):</label>
                  <input
                    type="text"
                    disabled
                    value={teacher.school || 'SMK Seri Bintang'}
                    className="w-full p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Initial Announcement / Welcome Note:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Welcome class! Please submit the bond drawing exercise by Friday."
                  value={newRoomAnnouncement}
                  onChange={(e) => setNewRoomAnnouncement(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl text-[11px] text-indigo-900 font-medium">
                🔑 A unique <strong>Room Code</strong> (e.g. <code>CHEM-882</code>) will be generated automatically for your students to join!
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- CREATE EXERCISE MODAL ----------------- */}
      {isCreateExerciseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-indigo-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-indigo-900">
                Assign Chemistry Exercise to {selectedRoom?.name}
              </h3>
              <button
                onClick={() => setIsCreateExerciseOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Exercise Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lewis Structure & Coordinate Bond in NH₄⁺"
                  value={newExTitle}
                  onChange={(e) => setNewExTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Exercise Type:</label>
                  <select
                    value={newExType}
                    onChange={(e) => setNewExType(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="bond_drawing">Bond Drawing Canvas</option>
                    <option value="quiz_drill">Structured Quiz Drill</option>
                    <option value="past_year_structured">Past Year Question</option>
                    <option value="practical_apparatus">Practical Apparatus Setup</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">SPM Chapter:</label>
                  <select
                    value={newExChapter}
                    onChange={(e) => setNewExChapter(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {SPM_CHAPTERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {newExType === 'bond_drawing' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Molecule Formula:</label>
                  <input
                    type="text"
                    placeholder="e.g. NH₄⁺ (Ammonium ion), CCl₄, H₂O"
                    value={newExFormula}
                    onChange={(e) => setNewExFormula(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Instructions & Marking Rubric:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Draw the central atom with all outer electrons. Remember to include square brackets for ions."
                  value={newExDesc}
                  onChange={(e) => setNewExDesc(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateExerciseOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- HOMEWORK GRADING MODAL ----------------- */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-indigo-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-indigo-900">
                Grade {gradingSubmission.studentName}'s Homework
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Score Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Award Score (Out of {gradingSubmission.maxScore}):</label>
                <span className="text-sm font-black text-indigo-600">{gradeScore} Marks</span>
              </div>
              <input
                type="range"
                min="0"
                max={gradingSubmission.maxScore}
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Sticker Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Choose Reward Sticker:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '⭐ Excellent Standard!',
                  '🌟 Chemist of the Week!',
                  '🎯 SPM Full Marks Target!',
                  '💡 Neat Diagram & Labels!',
                  '🏆 Master Chemist!',
                  '⚡ Great Effort, Revise Octet!',
                ].map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => setGradeSticker(stk)}
                    className={`p-2 text-xs font-bold rounded-xl border transition cursor-pointer text-left ${
                      gradeSticker === stk
                        ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Teacher's Marking Remark:</label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 focus:outline-indigo-500"
              />
            </div>

            {gradeSuccessToast ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Mark awarded and sticker sent to student!</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGradeSubmission}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-200 transition cursor-pointer"
                >
                  Save & Dispatch Grade
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- DRAWING REMARK MODAL ----------------- */}
      {selectedDrawingForRemark && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-indigo-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-indigo-900">
                Send Teacher Feedback to {selectedDrawingForRemark.studentName}
              </h3>
              <button
                onClick={() => setSelectedDrawingForRemark(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sticker Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Choose Encouragement Sticker:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '⭐ Excellent Standard!',
                  '🧪 Chemist of the Week!',
                  '💡 Neat Diagram & Labels!',
                  '🎯 SPM Full Marks Target!',
                ].map((stk) => (
                  <button
                    key={stk}
                    onClick={() => setRemarkSticker(stk)}
                    className={`p-2.5 text-xs font-bold rounded-xl border transition cursor-pointer text-left ${
                      remarkSticker === stk
                        ? 'bg-orange-100 border-orange-400 text-orange-900 ring-2 ring-orange-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Personalized Advice / Note:</label>
              <textarea
                rows={3}
                value={remarkComment}
                onChange={(e) => setRemarkComment(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 focus:outline-indigo-500"
              />
            </div>

            {feedbackSuccessToast ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                ✨ Feedback and sticker sent successfully!
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedDrawingForRemark(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTeacherRemark}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-200 transition cursor-pointer"
                >
                  Send to Student
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
