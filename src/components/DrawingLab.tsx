import React, { useRef, useState, useEffect } from 'react';
import { DrawingChallenge, DrawingSubmission, UserProfile } from '../types';
import { DRAWING_CHALLENGES } from '../data/chemistryData';
import { saveDrawingSubmission } from '../utils/storage';
import { evaluateSPMDrawing, ActionLogItem, DrawingEvaluationResult } from '../utils/drawingEvaluator';
import confetti from 'canvas-confetti';
import {
  Pencil,
  Eraser,
  Minus,
  Circle,
  Square,
  Type,
  RotateCcw,
  Trash2,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  ChevronRight,
  BookOpen,
  Eye,
  X,
  Plus,
  Check,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface DrawingLabProps {
  user: UserProfile;
  initialChallengeId?: string;
  onSubmissionSuccess?: (sub: DrawingSubmission) => void;
}

type ToolType = 'pencil' | 'line' | 'circle' | 'rect' | 'eraser' | 'stamp' | 'text';

interface StampItem {
  id: string;
  name: string;
  icon: string;
  category: 'apparatus' | 'atomic' | 'symbols';
  draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
}

export const DrawingLab: React.FC<DrawingLabProps> = ({
  user,
  initialChallengeId,
  onSubmissionSuccess,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<DrawingChallenge>(
    DRAWING_CHALLENGES.find((c) => c.id === initialChallengeId) || DRAWING_CHALLENGES[0]
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('pencil');
  const [brushColor, setBrushColor] = useState('#1e293b'); // dark slate
  const [brushSize, setBrushSize] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedStamp, setSelectedStamp] = useState<string>('beaker');
  const [labelText, setLabelText] = useState('0.1 mol dm⁻³ HCl');
  const [showModelAnswerModal, setShowModelAnswerModal] = useState(false);

  // Drawing History for Undo
  const historyRef = useRef<ImageData[]>([]);
  const actionLogRef = useRef<ActionLogItem[]>([]);
  const actionHistoryRef = useRef<ActionLogItem[][]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // Drawing interaction state
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);
  const currentStrokePoints = useRef<{ x: number; y: number }[]>([]);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<DrawingEvaluationResult | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-res canvas
    canvas.width = 800;
    canvas.height = 540;

    // Background white fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state to history
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    actionLogRef.current = [];
    actionHistoryRef.current = [[]];
    setCanUndo(false);
    setEvaluationResult(null);

    // Set default label text based on challenge
    if (selectedChallenge.id === 'draw_atom_mg_cl') {
      setLabelText('Susunan elektron: 2.8.2');
    } else if (selectedChallenge.id === 'draw_covalent_h2o') {
      setLabelText('Molekul Air (H₂O)');
    } else if (selectedChallenge.id === 'draw_voltaic_cell') {
      setLabelText('1.0 mol dm⁻³ CuSO₄');
    } else if (selectedChallenge.id === 'draw_titration_setup') {
      setLabelText('0.1 mol dm⁻³ HCl');
    }
  }, [selectedChallenge]);

  // Stamp library definitions with accurate scientific rendering
  const stamps: StampItem[] = [
    {
      id: 'beaker',
      name: 'Beaker (100ml)',
      icon: '🥛',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        // Glass body
        ctx.strokeRect(x - 35, y - 45, 70, 90);
        // Beaker lip spout
        ctx.beginPath();
        ctx.moveTo(x - 35, y - 45);
        ctx.lineTo(x - 42, y - 50);
        ctx.stroke();
        // Liquid meniscus
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillRect(x - 34, y - 10, 68, 54);
        ctx.fillStyle = '#0284c7';
        ctx.font = '10px sans-serif';
        ctx.fillText('100ml', x - 25, y + 10);
        ctx.restore();
      },
    },
    {
      id: 'conical_flask',
      name: 'Conical Flask',
      icon: '🧪',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 50); // neck left
        ctx.lineTo(x - 12, y - 20);
        ctx.lineTo(x - 45, y + 45); // base left
        ctx.lineTo(x + 45, y + 45); // base right
        ctx.lineTo(x + 12, y - 20);
        ctx.lineTo(x + 12, y - 50); // neck right
        ctx.stroke();
        // Liquid
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.beginPath();
        ctx.moveTo(x - 30, y + 15);
        ctx.lineTo(x - 43, y + 43);
        ctx.lineTo(x + 43, y + 43);
        ctx.lineTo(x + 30, y + 15);
        ctx.fill();
        ctx.restore();
      },
    },
    {
      id: 'burette',
      name: 'Burette & Scale',
      icon: '📏',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        // Long tube
        ctx.strokeRect(x - 8, y - 90, 16, 160);
        // Liquid inside burette
        ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
        ctx.fillRect(x - 6, y - 80, 12, 145);
        // Stopcock
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x - 14, y + 65, 28, 8);
        // Jet tip
        ctx.beginPath();
        ctx.moveTo(x - 6, y + 73);
        ctx.lineTo(x, y + 95);
        ctx.lineTo(x + 6, y + 73);
        ctx.stroke();
        // Scale markings
        for (let i = -80; i <= 50; i += 12) {
          ctx.beginPath();
          ctx.moveTo(x - 8, y + i);
          ctx.lineTo(x - 2, y + i);
          ctx.stroke();
        }
        ctx.restore();
      },
    },
    {
      id: 'retort_stand',
      name: 'Retort Stand & Clamp',
      icon: '🏗️',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        // Base
        ctx.fillRect(x - 40, y + 70, 80, 14);
        // Tall rod
        ctx.fillRect(x - 30, y - 90, 6, 160);
        // Clamp arm
        ctx.fillStyle = '#475569';
        ctx.fillRect(x - 30, y - 20, 45, 8);
        ctx.fillRect(x + 10, y - 35, 6, 35);
        ctx.restore();
      },
    },
    {
      id: 'white_tile',
      name: 'White Tile',
      icon: '⬜',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.fillRect(x - 50, y - 8, 100, 16);
        ctx.strokeRect(x - 50, y - 8, 100, 16);
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Jubin Putih', x, y + 4);
        ctx.restore();
      },
    },
    {
      id: 'voltmeter',
      name: 'Voltmeter (V)',
      icon: '📟',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('V', x, y);
        // Terminals (+ red, - blue)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 12, y + 22, 8, 8);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x - 20, y + 22, 8, 8);
        ctx.restore();
      },
    },
    {
      id: 'electrode_zn',
      name: 'Zinc Plate (-)',
      icon: '🩶',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.fillRect(x - 8, y - 45, 16, 90);
        ctx.strokeRect(x - 8, y - 45, 16, 90);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Zn (-)', x, y);
        ctx.restore();
      },
    },
    {
      id: 'electrode_cu',
      name: 'Copper Plate (+)',
      icon: '🟫',
      category: 'apparatus',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.fillRect(x - 8, y - 45, 16, 90);
        ctx.strokeRect(x - 8, y - 45, 16, 90);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cu (+)', x, y);
        ctx.restore();
      },
    },
    {
      id: 'nucleus_mg',
      name: 'Mg Nucleus (12p, 12n)',
      icon: '⚛️',
      category: 'atomic',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('12p, 12n', x, y);
        ctx.restore();
      },
    },
    {
      id: 'nucleus_o',
      name: 'Oxygen Nucleus (8p, 8n)',
      icon: '🔴',
      category: 'atomic',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('8p, 8n', x, y);
        ctx.restore();
      },
    },
    {
      id: 'nucleus_h',
      name: 'Hydrogen Nucleus (1p)',
      icon: '⚪',
      category: 'atomic',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1p', x, y);
        ctx.restore();
      },
    },
    {
      id: 'electron_dot',
      name: 'Electron Dot (•)',
      icon: '🔵',
      category: 'atomic',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: 'electron_cross',
      name: 'Electron Cross (×)',
      icon: '❌',
      category: 'atomic',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 6, y - 6);
        ctx.lineTo(x + 6, y + 6);
        ctx.moveTo(x + 6, y - 6);
        ctx.lineTo(x - 6, y + 6);
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: 'shell_ring',
      name: 'Shell Ring / Orbit',
      icon: '⭕',
      category: 'atomic',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y, 55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: 'arrow_pointer',
      name: 'Label Pointer Arrow',
      icon: '➡️',
      category: 'symbols',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#0f172a';
        ctx.fillStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 40, y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 10, y - 6);
        ctx.lineTo(x - 10, y + 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      },
    },
    {
      id: 'arrow_electron_flow',
      name: 'Electron Flow (e⁻ →)',
      icon: '⚡',
      category: 'symbols',
      draw: (ctx, x, y) => {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.fillStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 35, y);
        ctx.lineTo(x + 15, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 25, y);
        ctx.lineTo(x + 12, y - 6);
        ctx.lineTo(x + 12, y + 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('e⁻ flow', x, y - 10);
        ctx.restore();
      },
    },
  ];

  // Helper to get Canvas Coordinates
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
    return {
      x: (mouseEvent.clientX - rect.left) * scaleX,
      y: (mouseEvent.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    startPosRef.current = coords;
    currentStrokePoints.current = [coords];
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (activeTool === 'stamp') {
      const stampItem = stamps.find((s) => s.id === selectedStamp);
      if (stampItem) {
        stampItem.draw(ctx, coords.x, coords.y);
        recordAction({
          type: 'stamp',
          id: stampItem.id,
          name: stampItem.name,
          x: coords.x,
          y: coords.y,
        });
        saveSnapshot();
      }
      isDrawingRef.current = false;
      return;
    }

    if (activeTool === 'text') {
      ctx.save();
      ctx.fillStyle = brushColor;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(labelText, coords.x, coords.y);
      ctx.restore();
      recordAction({
        type: 'text',
        text: labelText,
        x: coords.x,
        y: coords.y,
        color: brushColor,
      });
      saveSnapshot();
      isDrawingRef.current = false;
      return;
    }

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = activeTool === 'eraser' ? brushSize * 4 : brushSize;
      ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : brushColor;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      currentStrokePoints.current.push(coords);
    } else if (snapshotRef.current) {
      // For shapes/lines: restore snapshot and preview
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
      ctx.lineCap = 'round';

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPosRef.current.x, startPosRef.current.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'circle') {
        const radius = Math.hypot(coords.x - startPosRef.current.x, coords.y - startPosRef.current.y);
        ctx.beginPath();
        ctx.arc(startPosRef.current.x, startPosRef.current.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.strokeRect(
          startPosRef.current.x,
          startPosRef.current.y,
          coords.x - startPosRef.current.x,
          coords.y - startPosRef.current.y
        );
      }
    }
  };

  const handleMouseUp = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    // Log the completed shape or pen stroke
    if (activeTool === 'line' && e) {
      const endCoords = getCanvasCoords(e);
      recordAction({
        type: 'line',
        x1: startPosRef.current.x,
        y1: startPosRef.current.y,
        x2: endCoords.x,
        y2: endCoords.y,
        color: brushColor,
        size: brushSize,
      });
    } else if (activeTool === 'circle' && e) {
      const endCoords = getCanvasCoords(e);
      const radius = Math.hypot(endCoords.x - startPosRef.current.x, endCoords.y - startPosRef.current.y);
      recordAction({
        type: 'circle',
        x: startPosRef.current.x,
        y: startPosRef.current.y,
        radius,
        color: brushColor,
        size: brushSize,
      });
    } else if (activeTool === 'rect' && e) {
      const endCoords = getCanvasCoords(e);
      recordAction({
        type: 'rect',
        x1: startPosRef.current.x,
        y1: startPosRef.current.y,
        x2: endCoords.x,
        y2: endCoords.y,
        color: brushColor,
        size: brushSize,
      });
    } else if (activeTool === 'pencil' && currentStrokePoints.current.length > 1) {
      recordAction({
        type: 'pen',
        color: brushColor,
        size: brushSize,
      });
    }

    currentStrokePoints.current = [];
    saveSnapshot();
  };

  const recordAction = (item: ActionLogItem) => {
    actionLogRef.current = [...actionLogRef.current, item];
    actionHistoryRef.current.push([...actionLogRef.current]);
  };

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(currentImg);
    if (historyRef.current.length > 25) historyRef.current.shift();
    setCanUndo(true);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyRef.current.pop(); // remove current
    if (actionHistoryRef.current.length > 1) {
      actionHistoryRef.current.pop();
      actionLogRef.current = actionHistoryRef.current[actionHistoryRef.current.length - 1] || [];
    }

    const previous = historyRef.current[historyRef.current.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
    setCanUndo(historyRef.current.length > 1);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    actionLogRef.current = [];
    actionHistoryRef.current = [[]];
    saveSnapshot();
    setEvaluationResult(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `SPM_Chemistry_Drawing_${selectedChallenge.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Quick Preset Label Buttons for each challenge
  const quickLabels: { [key: string]: string[] } = {
    draw_atom_mg_cl: [
      'Susunan elektron: 2.8.2',
      'Nukleus: 12p, 12n',
      'Petala pertama (2e⁻)',
      'Petala kedua (8e⁻)',
      '2 elektron valens',
      'Atom Magnesium, Mg',
    ],
    draw_covalent_h2o: [
      'Molekul Air, H₂O',
      'Ikatan kovalen tunggal (O-H)',
      'Pasangan elektron berkongsi',
      'Pasangan elektron bebas (Lone pair)',
      'Atom Oksigen (2.6)',
      'Atom Hidrogen (1)',
    ],
    draw_voltaic_cell: [
      '1.0 mol dm⁻³ CuSO₄',
      'Kepingan Zink, Zn (Anod / -)',
      'Kepingan Kuprum, Cu (Katod / +)',
      'Voltmeter (V)',
      'Pengaliran elektron: Zn → Cu',
      'Dawai penyambung',
    ],
    draw_titration_setup: [
      'Buret (0.1 mol dm⁻³ HCl)',
      'Kelalang kon (25 cm³ NaOH)',
      'Penunjuk Fenolftalein',
      'Jubin putih',
      'Kaki retort & pengapit',
      'Takat akhir: Merah jambu → Tanpa warna',
    ],
  };

  const activeQuickLabels = quickLabels[selectedChallenge.id] || [
    '0.1 mol dm⁻³ HCl',
    'Larutan akueus',
    'Elektrod',
    'Radas makmal',
  ];

  // Submit and Real SPM Assessment
  const handleSubmitDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsEvaluating(true);

    const dataUrl = canvas.toDataURL('image/png');

    setTimeout(() => {
      // Run the SPM Drawing Evaluator Engine
      const evaluation = evaluateSPMDrawing(canvas, selectedChallenge.id, actionLogRef.current);

      setEvaluationResult(evaluation);
      setIsEvaluating(false);

      if (evaluation.score >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Store submission for teacher and student
      const sub = saveDrawingSubmission({
        challengeId: selectedChallenge.id,
        studentId: user.id,
        studentName: user.name,
        studentAvatar: user.avatar,
        dataUrl,
        score: evaluation.score,
        isPassed: evaluation.isPassed,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      });

      if (onSubmissionSuccess) {
        onSubmissionSuccess(sub);
      }
    }, 450);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with Challenge Picker */}
      <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>SPM Interactive Drawing Lab</span>
            </span>
            {selectedChallenge.isHotSPM && (
              <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                🔥 2026 Hot Topic
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-900 tracking-tight">
            {selectedChallenge.title}
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            {selectedChallenge.prompt}
          </p>
        </div>

        {/* Challenge selector dropdown & Model Answer Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowModelAnswerModal(true)}
            className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-amber-900 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>View SPM Model Answer</span>
          </button>

          <select
            id="challenge-select"
            value={selectedChallenge.id}
            onChange={(e) => {
              const found = DRAWING_CHALLENGES.find((c) => c.id === e.target.value);
              if (found) setSelectedChallenge(found);
            }}
            className="px-3.5 py-2.5 bg-slate-50 border-2 border-indigo-100 rounded-2xl text-xs font-bold text-slate-700 focus:outline-indigo-500 cursor-pointer shadow-2xs"
          >
            {DRAWING_CHALLENGES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.isHotSPM ? '🔥 ' : ''}{c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Drawing Stage & Toolbars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toolbar (Tools, Colors, Stamps) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Drawing Tools */}
          <div className="bg-white p-4 rounded-3xl border-2 border-indigo-50 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Drawing Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTool('pencil')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTool === 'pencil' ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                }`}
              >
                <Pencil className="w-4 h-4" />
                <span className="text-[10px] font-bold">Pen</span>
              </button>

              <button
                onClick={() => setActiveTool('line')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTool === 'line' ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span className="text-[10px] font-bold">Line</span>
              </button>

              <button
                onClick={() => setActiveTool('circle')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTool === 'circle' ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                }`}
              >
                <Circle className="w-4 h-4" />
                <span className="text-[10px] font-bold">Circle</span>
              </button>

              <button
                onClick={() => setActiveTool('rect')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTool === 'rect' ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                }`}
              >
                <Square className="w-4 h-4" />
                <span className="text-[10px] font-bold">Box</span>
              </button>

              <button
                onClick={() => setActiveTool('eraser')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTool === 'eraser' ? 'bg-rose-500 text-white border-rose-600 shadow-sm' : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200'
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span className="text-[10px] font-bold">Eraser</span>
              </button>

              <button
                onClick={() => setActiveTool('text')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTool === 'text' ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                }`}
              >
                <Type className="w-4 h-4" />
                <span className="text-[10px] font-bold">Label (T)</span>
              </button>
            </div>

            {/* Text label input when text tool active */}
            {activeTool === 'text' && (
              <div className="pt-2 space-y-2 animate-fadeIn">
                <label className="text-[11px] font-bold text-slate-600">Label Text (Click canvas to place):</label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  placeholder="e.g. Zinc electrode (-)"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-indigo-500"
                />

                {/* Quick Label Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quick SPM Labels:</span>
                  <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                    {activeQuickLabels.map((ql, i) => (
                      <button
                        key={i}
                        onClick={() => setLabelText(ql)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold transition cursor-pointer ${
                          labelText === ql
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {ql}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Colors */}
            <div className="pt-2 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Color Palette:</label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#1e293b', name: 'Graphite' },
                  { color: '#4f46e5', name: 'Indigo' },
                  { color: '#ef4444', name: 'Flame Red' },
                  { color: '#10b981', name: 'Emerald' },
                  { color: '#f59e0b', name: 'Amber' },
                  { color: '#a855f7', name: 'Purple' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setBrushColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-7 h-7 rounded-full transition transform hover:scale-110 cursor-pointer ${
                      brushColor === c.color ? 'ring-3 ring-indigo-400 ring-offset-2 scale-110' : ''
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span>Thickness:</span>
                <span>{brushSize}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Apparatus & Atomic Stamps Library */}
          <div className="bg-white p-4 rounded-3xl border-2 border-indigo-50 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Stamp Apparatus</h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Click to stamp</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {stamps.map((stamp) => (
                <button
                  key={stamp.id}
                  onClick={() => {
                    setActiveTool('stamp');
                    setSelectedStamp(stamp.id);
                  }}
                  className={`p-2 rounded-2xl border text-left flex items-center gap-2 transition cursor-pointer ${
                    activeTool === 'stamp' && selectedStamp === stamp.id
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-lg">{stamp.icon}</span>
                  <span className="text-[11px] font-bold truncate">{stamp.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="lg:col-span-9 space-y-4">
          <div className="relative bg-white rounded-3xl p-4 border-2 border-indigo-50 shadow-sm flex flex-col items-center overflow-hidden">
            {/* Top Canvas Controls Bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="Undo last action"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>

                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="Clear drawing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                    showGrid ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Grid {showGrid ? 'On' : 'Off'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Image</span>
                </button>

                <button
                  onClick={handleSubmitDrawing}
                  disabled={isEvaluating}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-200 transition transform hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                  <span>{isEvaluating ? 'Verifying Diagram...' : 'Submit & Check Diagram ✨'}</span>
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div
              className={`relative mt-3 rounded-2xl overflow-hidden border-2 border-slate-200 cursor-crosshair touch-none ${
                showGrid
                  ? 'bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]'
                  : 'bg-white'
              }`}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                className="w-full max-w-[800px] h-[360px] sm:h-[460px] block"
              />

              {/* Active Stamp Preview Cursor Hint */}
              {activeTool === 'stamp' && (
                <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none backdrop-blur-xs shadow-md">
                  Active Stamp: {stamps.find((s) => s.id === selectedStamp)?.name}
                </div>
              )}
            </div>

            {/* SPM Exam Guide Checklist at bottom */}
            <div className="w-full mt-4 p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>SPM Diagram Scoring Checklist:</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Lembaga Peperiksaan Standard</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-indigo-800">
                {selectedChallenge.expectedElements.map((elem, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 bg-white/70 p-2 rounded-xl border border-indigo-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{elem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SPM Assessment Report Card */}
          {evaluationResult && (
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md animate-fadeIn space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-inner ${
                    evaluationResult.score >= 80
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                      : evaluationResult.score >= 70
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  }`}>
                    <span className="text-xl leading-none">{evaluationResult.score}%</span>
                    <span className="text-[9px] uppercase tracking-wider mt-0.5">Score</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-indigo-900">
                        {evaluationResult.score >= 80
                          ? '🌟 Excellent SPM Standard!'
                          : evaluationResult.score >= 70
                          ? '✅ Passed SPM Standard!'
                          : '💡 Needs Improvement'}
                      </h4>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        evaluationResult.isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {evaluationResult.isPassed ? 'Passed' : 'Needs Practice'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                      {evaluationResult.feedback}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-400">Recorded in</span>
                  <p className="text-xs font-bold text-indigo-600">Student Portfolio</p>
                </div>
              </div>

              {/* Detailed Criteria Checklist Breakdown */}
              {evaluationResult.criteria && evaluationResult.criteria.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>SPM Criteria Breakdown:</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {evaluationResult.criteria.map((crit) => (
                      <div
                        key={crit.id}
                        className={`p-3 rounded-2xl border transition ${
                          crit.status === 'passed'
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : crit.status === 'partial'
                            ? 'bg-amber-50/70 border-amber-200'
                            : 'bg-rose-50/70 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            {crit.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            {crit.status === 'partial' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                            {crit.status === 'missing' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                            <span className="text-xs font-black text-slate-800">{crit.name}</span>
                          </div>
                          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                            crit.status === 'passed'
                              ? 'bg-emerald-200 text-emerald-800'
                              : crit.status === 'partial'
                              ? 'bg-amber-200 text-amber-800'
                              : 'bg-rose-200 text-rose-800'
                          }`}>
                            {crit.earned}/{crit.points} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{crit.description}</p>
                        {crit.tip && crit.status !== 'passed' && (
                          <div className="mt-1.5 text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{crit.tip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                  <h5 className="text-xs font-black text-emerald-900 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Key Strengths:</span>
                  </h5>
                  <ul className="text-xs text-emerald-800 space-y-1 font-medium pl-4 list-disc">
                    {evaluationResult.strengths?.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                  <h5 className="text-xs font-black text-amber-900 flex items-center gap-1.5 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>SPM Marks Tip / Improvements:</span>
                  </h5>
                  <ul className="text-xs text-amber-800 space-y-1 font-medium pl-4 list-disc">
                    {evaluationResult.improvements?.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SPM Model Solution Modal */}
      {showModelAnswerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  📖
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Standard SPM Model Solution
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedChallenge.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModelAnswerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Standard solution description */}
            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider block">
                Official Skema Description:
              </span>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                {selectedChallenge.standardSolutionDescription}
              </p>
            </div>

            {/* Step by step guide steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Recommended Step-by-Step Drawing Method:
              </h4>
              <div className="space-y-2">
                {selectedChallenge.guideSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Examiner Hint */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{selectedChallenge.hint}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModelAnswerModal(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
              >
                Back to Drawing Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
