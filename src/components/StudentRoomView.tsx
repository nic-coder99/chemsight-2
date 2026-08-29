import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ClassroomRoom,
  RoomExercise,
  HomeworkSubmission,
} from '../types';
import {
  getRoomsForUser,
  joinClassroomByCode,
  getStoredExercises,
  getStoredHomeworkSubmissions,
  submitHomework,
} from '../utils/storage';
import { BondDrawingCanvas } from './BondDrawingCanvas';
import {
  Users,
  KeyRound,
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  Pencil,
  FileText,
  Upload,
  Layers,
  Lock,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface StudentRoomViewProps {
  user: UserProfile;
  onNavigateToDrawing?: (challengeId?: string) => void;
  onNavigateTo3DModel?: (modelId: string) => void;
}

export const StudentRoomView: React.FC<StudentRoomViewProps> = ({
  user,
  onNavigateToDrawing,
}) => {
  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [joinStatusMsg, setJoinStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Exercises & Submissions for selected room
  const [exercises, setExercises] = useState<RoomExercise[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);

  // Active Homework Submission Modal / Drawer
  const [activeExerciseForSubmission, setActiveExerciseForSubmission] = useState<RoomExercise | null>(null);
  const [submissionTab, setSubmissionTab] = useState<'drawing' | 'text_upload'>('drawing');
  const [studentNotes, setStudentNotes] = useState('');
  const [drawingDataUrl, setDrawingDataUrl] = useState<string>('');
  const [drawingPassed, setDrawingPassed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(false);

  // Reload rooms
  const refreshRooms = () => {
    const userRooms = getRoomsForUser(user);
    setRooms(userRooms);
    if (userRooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(userRooms[0].id);
    }
  };

  useEffect(() => {
    refreshRooms();
  }, [user.id]);

  useEffect(() => {
    if (selectedRoomId) {
      setExercises(getStoredExercises(selectedRoomId));
      setSubmissions(getStoredHomeworkSubmissions(selectedRoomId, undefined, user.id));
    }
  }, [selectedRoomId, user.id]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;

    const result = joinClassroomByCode(roomCodeInput, user.id);
    if (result.success) {
      setJoinStatusMsg({ type: 'success', text: result.message });
      setRoomCodeInput('');
      refreshRooms();
      if (result.room) {
        setSelectedRoomId(result.room.id);
      }
    } else {
      setJoinStatusMsg({ type: 'error', text: result.message });
    }

    setTimeout(() => {
      setJoinStatusMsg(null);
    }, 4000);
  };

  const handleDrawingEvaluated = (result: {
    score: number;
    maxScore: number;
    feedback: string;
    isPassed: boolean;
    dataUrl: string;
  }) => {
    setDrawingDataUrl(result.dataUrl);
    setDrawingPassed(result.isPassed);
  };

  const handleSubmitHomework = () => {
    if (!activeExerciseForSubmission || !selectedRoom) return;

    setIsSubmitting(true);

    const submissionData = {
      exerciseId: activeExerciseForSubmission.id,
      roomId: selectedRoom.id,
      studentId: user.id,
      studentName: user.name,
      studentAvatar: user.avatar,
      school: selectedRoom.school,
      studentNotes: studentNotes.trim() || 'Attached completed chemistry exercise.',
      drawingDataUrl: drawingDataUrl || undefined,
      maxScore: activeExerciseForSubmission.totalPoints,
      studentForm: user.form,
    };

    submitHomework(submissionData);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccessNotice(true);
      setSubmissions(getStoredHomeworkSubmissions(selectedRoom.id, undefined, user.id));

      setTimeout(() => {
        setSubmitSuccessNotice(false);
        setActiveExerciseForSubmission(null);
        setDrawingDataUrl('');
        setStudentNotes('');
      }, 1200);
    }, 600);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner with School Privacy Isolation Badge */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-200" />
              <span>School Chemistry Rooms</span>
            </span>
            <span className="px-3 py-1 bg-emerald-400/90 text-slate-950 text-xs font-black rounded-full flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Private School Data Isolation</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Classroom Rooms & Homework Portal 🏫
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-xl">
            Join your chemistry teacher's exclusive classroom with their room code. Do assigned exercises, submit your bond drawings, and receive teacher marks & stickers!
          </p>
        </div>

        {/* Join Room Code Input Form */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 sm:w-80 shrink-0 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black text-indigo-100">
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Join Class With Room Code</span>
          </div>

          <form onSubmit={handleJoinRoom} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CHEM-501"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2 text-xs font-black uppercase bg-white text-slate-900 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition shrink-0 cursor-pointer"
            >
              Join
            </button>
          </form>

          {joinStatusMsg && (
            <div
              className={`p-2 rounded-xl text-xs font-bold text-center ${
                joinStatusMsg.type === 'success'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              }`}
            >
              {joinStatusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* Room Selection Tabs */}
      {rooms.length > 0 ? (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2.5 whitespace-nowrap border-2 ${
                  isSelected
                    ? 'bg-white border-indigo-600 text-indigo-900 shadow-md ring-2 ring-indigo-100'
                    : 'bg-white/70 border-indigo-50 text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  🏫
                </div>
                <div className="text-left">
                  <p className="font-black leading-tight">{room.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {room.school} • Code: <strong className="text-indigo-600">{room.code}</strong>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-indigo-200 text-center space-y-3">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto">
            🔑
          </div>
          <h3 className="text-base font-black text-indigo-950">No Enrolled Rooms Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Ask your chemistry teacher for their <strong>Room Code</strong> (e.g. <code>CHEM-501</code>) and enter it above to join your class!
          </p>
        </div>
      )}

      {/* Active Room Content */}
      {selectedRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Room Info & Announcements */}
          <div className="lg:col-span-4 space-y-6">
            {/* Room Info Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-indigo-950">{selectedRoom.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{selectedRoom.school}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-black text-xs rounded-xl">
                  {selectedRoom.code}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">Subject:</span>
                  <span className="font-black text-slate-900">{selectedRoom.subject}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">Teacher:</span>
                  <span className="font-black text-indigo-700">{selectedRoom.teacherName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">Enrolled Classmates:</span>
                  <span className="font-black text-emerald-600">{selectedRoom.studentIds.length} students</span>
                </div>
              </div>

              {/* Teacher Announcement */}
              {selectedRoom.announcement && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <span>📢</span>
                    <span>Teacher Announcement</span>
                  </h4>
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    {selectedRoom.announcement}
                  </p>
                </div>
              )}
            </div>

            {/* School Privacy Note */}
            <div className="p-5 bg-indigo-50/60 rounded-3xl border border-indigo-100 space-y-2 text-xs">
              <h4 className="font-black text-indigo-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>School Data Isolation Active</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Your homework submissions, drawings, and scores are only visible to <strong>{selectedRoom.teacherName}</strong> from <strong>{selectedRoom.school}</strong>. Teachers from other schools cannot access your work.
              </p>
            </div>
          </div>

          {/* Right Column: Room Exercises & Submissions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Assigned Exercises List */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Assigned Exercises ({exercises.length})</span>
                </h3>
                <span className="text-xs font-bold text-slate-400">Teacher Assignments</span>
              </div>

              {exercises.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium">
                  No homework exercises uploaded by your teacher yet. Check back soon!
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((ex) => {
                    const submission = submissions.find((s) => s.exerciseId === ex.id);

                    return (
                      <div
                        key={ex.id}
                        className={`p-5 rounded-3xl border-2 transition space-y-3.5 ${
                          submission?.status === 'graded'
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : submission?.status === 'submitted'
                            ? 'bg-blue-50/40 border-blue-200'
                            : 'bg-white border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full uppercase">
                                {ex.type.replace('_', ' ')}
                              </span>
                              {ex.targetBondFormula && (
                                <span className="px-2.5 py-0.5 bg-pink-100 text-pink-800 text-[10px] font-black rounded-full">
                                  Bond: {ex.targetBondFormula}
                                </span>
                              )}
                              <span className="text-xs text-slate-400 font-bold">
                                {ex.totalPoints} Marks
                              </span>
                            </div>
                            <h4 className="text-base font-black text-slate-900">{ex.title}</h4>
                          </div>

                          {/* Submission Status Badge */}
                          <div>
                            {submission?.status === 'graded' ? (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black rounded-full flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Graded: {submission.score}/{ex.totalPoints}</span>
                              </span>
                            ) : submission?.status === 'submitted' ? (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 text-xs font-black rounded-full flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                <span>Submitted • Awaiting Teacher Mark</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-200 text-xs font-black rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                                <span>Due: {ex.dueDate}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {ex.description}
                        </p>

                        {/* Instructions Checklist */}
                        {ex.instructions && ex.instructions.length > 0 && (
                          <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                            <span className="text-[11px] font-black text-indigo-900 uppercase">
                              Instructions:
                            </span>
                            <ul className="space-y-1">
                              {ex.instructions.map((inst, i) => (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                  <span className="text-indigo-600 font-black">•</span>
                                  <span>{inst}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Teacher Feedback & Sticker If Graded */}
                        {submission && submission.status === 'graded' && (
                          <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-emerald-700" />
                                <span>Teacher Feedback from {selectedRoom.teacherName}:</span>
                              </span>
                              {submission.teacherSticker && (
                                <span className="px-2.5 py-0.5 bg-amber-200 text-amber-950 text-xs font-black rounded-lg shadow-xs">
                                  {submission.teacherSticker}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-900 font-medium">
                              {submission.teacherFeedback}
                            </p>
                          </div>
                        )}

                        {/* Student Submitted Drawing Preview if exists */}
                        {submission?.drawingDataUrl && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400">Your Submitted Diagram:</span>
                            <div className="w-48 h-28 rounded-xl bg-white border border-slate-200 overflow-hidden">
                              <img
                                src={submission.drawingDataUrl}
                                alt="Your Submission"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          {submission ? (
                            <button
                              onClick={() => {
                                setActiveExerciseForSubmission(ex);
                                setStudentNotes(submission.studentNotes || '');
                                setDrawingDataUrl(submission.drawingDataUrl || '');
                              }}
                              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition cursor-pointer"
                            >
                              <span>Update / Resubmit</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveExerciseForSubmission(ex);
                                setStudentNotes('');
                                setDrawingDataUrl('');
                              }}
                              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Submit Homework</span>
                            </button>
                          )}
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

      {/* Homework Submission Modal / Drawer */}
      {activeExerciseForSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-indigo-100 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full uppercase">
                  Submit to {selectedRoom?.name}
                </span>
                <h3 className="text-lg font-black text-indigo-950 mt-1">
                  {activeExerciseForSubmission.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveExerciseForSubmission(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Submission Mode Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setSubmissionTab('drawing')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  submissionTab === 'drawing'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                <span>Interactive Chemistry Canvas</span>
              </button>

              <button
                onClick={() => setSubmissionTab('text_upload')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  submissionTab === 'text_upload'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Text Explanation / Notes</span>
              </button>
            </div>

            {/* Tab 1: Interactive Canvas */}
            {submissionTab === 'drawing' && (
              <div className="space-y-4">
                <BondDrawingCanvas
                  targetFormula={activeExerciseForSubmission.targetBondFormula || 'Chemical Bond Formation'}
                  bondType="covalent"
                  hint={activeExerciseForSubmission.description}
                  onDrawingEvaluated={handleDrawingEvaluated}
                />
              </div>
            )}

            {/* Tab 2: Text / Written Notes */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800">
                Student Notes / Working Steps (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="Write your explanation or note to your teacher here (e.g. Electron sharing step between Carbon and Hydrogen)..."
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Success Toast or Footer Action Buttons */}
            {submitSuccessNotice ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Homework uploaded and submitted to teacher successfully!</span>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">
                  🔒 Visible only to {selectedRoom?.teacherName}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveExerciseForSubmission(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmitHomework}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-200 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Uploading...' : 'Confirm Submission'}</span>
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
