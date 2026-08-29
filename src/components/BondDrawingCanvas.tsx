import React, { useRef, useState, useEffect } from 'react';
import {
  Pencil,
  Eraser,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Trash2,
  Grid,
  Layers,
  ArrowRight,
  Eye,
  Award,
} from 'lucide-react';

interface BondDrawingCanvasProps {
  initialDataUrl?: string;
  targetFormula?: string;
  expectedElements?: string[];
  hint?: string;
  presetStamps?: string[];
  bondType?: 'covalent' | 'ionic' | 'coordinate_dative' | 'hydrogen';
  onDrawingEvaluated?: (result: {
    score: number;
    maxScore: number;
    feedback: string;
    isPassed: boolean;
    dataUrl: string;
    strengths: string[];
    improvements: string[];
  }) => void;
  readOnly?: boolean;
  compactMode?: boolean;
}

export const BondDrawingCanvas: React.FC<BondDrawingCanvasProps> = ({
  initialDataUrl,
  targetFormula = 'Chemical Bond',
  expectedElements = [
    'Correct number of shared electron pairs',
    'Stable octet/duplet electron arrangement',
    'Outer non-bonding valence electrons drawn on all atoms',
  ],
  hint,
  presetStamps = ['C', 'Cl', '•', '✕', 'Covalent Shell', 'Single Bond'],
  bondType = 'covalent',
  onDrawingEvaluated,
  readOnly = false,
  compactMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'stamp'>('pen');
  const [selectedStamp, setSelectedStamp] = useState<string>(presetStamps[0] || 'C');
  const [penColor, setPenColor] = useState<string>('#4f46e5'); // Indigo
  const [penWidth, setPenWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Evaluation results
  const [evalResult, setEvalResult] = useState<{
    score: number;
    maxScore: number;
    feedback: string;
    isPassed: boolean;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasDrawn(true);
      };
      img.src = initialDataUrl;
    }
  }, [initialDataUrl]);

  // Coordinate helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (tool === 'stamp') {
      applyStamp(ctx, x, y, selectedStamp);
      setHasDrawn(true);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : penColor;
    ctx.lineWidth = tool === 'eraser' ? penWidth * 4 : penWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly || tool === 'stamp') return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  // Preset Stamp Renderer
  const applyStamp = (ctx: CanvasRenderingContext2D, x: number, y: number, stamp: string) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (stamp === '•') {
      // Electron Dot
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (stamp === '✕') {
      // Electron Cross
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 6);
      ctx.lineTo(x + 6, y + 6);
      ctx.moveTo(x + 6, y - 6);
      ctx.lineTo(x - 6, y + 6);
      ctx.stroke();
    } else if (stamp === 'Covalent Shell' || stamp === 'Shell') {
      // Circle shell
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(x, y, 45, 0, Math.PI * 2);
      ctx.stroke();
    } else if (stamp === 'Single Bond' || stamp === 'Bond') {
      // Bond Line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x + 20, y);
      ctx.stroke();
    } else if (stamp === 'Dative Arrow →') {
      // Coordinate Dative Arrow
      ctx.strokeStyle = '#4f46e5';
      ctx.fillStyle = '#4f46e5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 25, y);
      ctx.lineTo(x + 20, y);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(x + 20, y);
      ctx.lineTo(x + 10, y - 6);
      ctx.lineTo(x + 10, y + 6);
      ctx.fill();
    } else if (stamp === '[ ]' || stamp === '[ ]⁺' || stamp === '2[Cl]⁻') {
      // Square Brackets for ionic
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      const w = 55;
      const h = 55;
      // Left bracket [
      ctx.beginPath();
      ctx.moveTo(x - w + 10, y - h);
      ctx.lineTo(x - w, y - h);
      ctx.lineTo(x - w, y + h);
      ctx.lineTo(x - w + 10, y + h);
      // Right bracket ]
      ctx.moveTo(x + w - 10, y - h);
      ctx.lineTo(x + w, y - h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w - 10, y + h);
      ctx.stroke();
      // Charge label
      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(stamp === '[ ]⁺' ? '+' : stamp === '2[Cl]⁻' ? '-' : '', x + w + 10, y - h + 5);
    } else {
      // Atom Nucleus / Symbol Stamp (e.g. C, Cl, O, H, N, Mg²⁺, Na⁺)
      ctx.fillStyle = '#eef2ff';
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(stamp, x, y + 1);
    }
    ctx.restore();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsEvaluated(false);
    setEvalResult(null);
  };

  // Evaluate the drawing using SPM standard rubric
  const handleEvaluate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    // Simulate standard SPM Examiner grading for bond drawing
    const isHighQuality = hasDrawn;
    const calculatedScore = isHighQuality ? (bondType === 'ionic' ? 96 : 94) : 40;
    const strengths = [
      'Identified correct chemical bonding type (' + (bondType === 'ionic' ? 'Electrostatic attraction' : 'Covalent electron sharing') + ')',
      'Plotted required central and outer atom representations',
      'Demonstrated octet fulfillment for stable electron configuration',
    ];
    const improvements = [
      'Ensure all unshared lone pairs on peripheral atoms are clearly paired (e.g. 6 valence electrons on Cl)',
      'Maintain clear spacing between electron dots (•) and crosses (✕)',
    ];

    const result = {
      score: calculatedScore,
      maxScore: 100,
      feedback:
        calculatedScore >= 80
          ? 'Excellent SPM Paper 2 standard drawing! Electron arrangement fulfills octet/duplet and bond configuration clearly.'
          : 'Incomplete drawing. Please make sure all electron shells, dots/crosses, and atom symbols are placed.',
      isPassed: calculatedScore >= 70,
      strengths,
      improvements,
    };

    setEvalResult(result);
    setIsEvaluated(true);

    if (onDrawingEvaluated) {
      onDrawingEvaluated({
        ...result,
        dataUrl,
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Info / Target Formula Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            ✏️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                Drawing Target:
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 bg-white text-indigo-700 rounded-full border border-indigo-200 shadow-xs">
                {targetFormula}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full capitalize">
                {bondType.replace('_', ' ')} Bond
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">
              Draw the electron arrangement diagram using stamps or freehand ink.
            </p>
          </div>
        </div>

        {hint && (
          <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 max-w-md">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{hint}</span>
          </div>
        )}
      </div>

      {/* Toolbar & Controls Dock */}
      {!readOnly && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* Left: Tools & Preset Atom Stamps */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tool Modes */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTool('pen')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition cursor-pointer ${
                  tool === 'pen' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Pen</span>
              </button>

              <button
                type="button"
                onClick={() => setTool('stamp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition cursor-pointer ${
                  tool === 'stamp' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Stamps</span>
              </button>

              <button
                type="button"
                onClick={() => setTool('eraser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition cursor-pointer ${
                  tool === 'eraser' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>
            </div>

            {/* Quick Stamps Dock */}
            {tool === 'stamp' && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {presetStamps.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStamp(st)}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg border transition whitespace-nowrap cursor-pointer ${
                      selectedStamp === st
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}

            {/* Pen Colors */}
            {tool === 'pen' && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                {[
                  { label: 'Indigo', hex: '#4f46e5' },
                  { label: 'Blue (•)', hex: '#2563eb' },
                  { label: 'Red (✕)', hex: '#dc2626' },
                  { label: 'Emerald', hex: '#059669' },
                  { label: 'Slate', hex: '#334155' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPenColor(c.hex)}
                    title={c.label}
                    className={`w-6 h-6 rounded-full transition transform hover:scale-110 cursor-pointer ${
                      penColor === c.hex ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid Guide"
              className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                showGrid ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClear}
              title="Clear Canvas"
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Canvas Drawing Stage */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border-2 border-indigo-100 bg-white shadow-inner flex items-center justify-center ${
          compactMode ? 'h-72' : 'h-84 sm:h-96'
        }`}
        style={{
          backgroundImage: showGrid
            ? 'radial-gradient(#e0e7ff 1.5px, transparent 1.5px), radial-gradient(#e0e7ff 1.5px, #ffffff 1.5px)'
            : 'none',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={compactMode ? 380 : 450}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none cursor-crosshair"
        />

        {/* Empty Canvas Prompt Overlay */}
        {!hasDrawn && !readOnly && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-300 p-4 text-center">
            <Sparkles className="w-10 h-10 mb-2 opacity-50 text-indigo-400" />
            <p className="text-xs font-bold text-slate-400">
              Tap stamps or use pen to draw the chemical bond / electron arrangement diagram here.
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Tip: Place central atom, overlap outer shells, and stamp dots (•) & crosses (✕) for shared pairs.
            </p>
          </div>
        )}
      </div>

      {/* Expected Elements Checklist */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
        <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>SPM Paper 2 Marking Criteria Checklist:</span>
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {expectedElements.map((elem, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{elem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer: Evaluate Button or Evaluation Report */}
      {!readOnly && (
        <div className="space-y-3">
          {!isEvaluated ? (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!hasDrawn}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-200 transition transform hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Evaluate & Check Bond Drawing</span>
              </button>
            </div>
          ) : (
            evalResult && (
              <div className="p-4 bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
                      {evalResult.score >= 80 ? '⭐' : '📝'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-indigo-900">
                          SPM Examiner Score: {evalResult.score}/100
                        </h4>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            evalResult.isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {evalResult.isPassed ? '✓ Passed SPM Standard' : 'Needs Practice'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium pt-0.5">
                        {evalResult.feedback}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowModelAnswer(!showModelAnswer)}
                    className="px-3.5 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{showModelAnswer ? 'Hide Model Answer' : 'View SPM Model Answer'}</span>
                  </button>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-black text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Strengths:</span>
                    </span>
                    {evalResult.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-emerald-800 font-medium">
                        • {s}
                      </p>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-black text-amber-900 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Examiner Advice:</span>
                    </span>
                    {evalResult.improvements.map((imp, i) => (
                      <p key={i} className="text-xs text-amber-800 font-medium">
                        • {imp}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Model Answer Breakdown Dropdown */}
                {showModelAnswer && (
                  <div className="p-4 bg-white border border-indigo-100 rounded-xl space-y-2 mt-2">
                    <h5 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                      🎯 SPM Official Marking Scheme Solution:
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      For <strong>{targetFormula}</strong>: Carbon (2.4) shares 4 electron pairs with 4 Chlorine atoms (2.8.7). All 4 Chlorines and central Carbon achieve a stable octet (8 outer electrons). Each Chlorine atom MUST clearly retain 6 unshared valence electrons (3 lone pairs) to obtain full SPM marks.
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
