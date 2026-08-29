import React, { useState } from 'react';
import { Model3DData, SPMChapterId } from '../types';
import { MODELS_3D, SPM_CHAPTERS, QUALITATIVE_TESTS } from '../data/chemistryData';
import { ThreeDViewer } from './ThreeDViewer';
import {
  BookOpen,
  Sparkles,
  Search,
  Eye,
  Layers,
  FlaskConical,
  Flame,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Cpu,
  Atom,
} from 'lucide-react';

interface NotesViewerProps {
  initialModelId?: string;
  onNavigateToDrawing?: (challengeId?: string) => void;
}

export const NotesViewer: React.FC<NotesViewerProps> = ({
  initialModelId,
  onNavigateToDrawing,
}) => {
  const [selectedModel, setSelectedModel] = useState<Model3DData>(
    MODELS_3D.find((m) => m.id === initialModelId) || MODELS_3D[0]
  );
  const [activeTab, setActiveTab] = useState<'3d_models' | 'qualitative_analysis' | 'ai_note_maker'>('3d_models');
  const [modelFormFilter, setModelFormFilter] = useState<'all' | 4 | 5>('all');

  // Filtered 3D Models
  const filteredModels = MODELS_3D.filter((m) => {
    if (modelFormFilter === 'all') return true;
    const chap = SPM_CHAPTERS.find((c) => c.id === m.chapterId);
    return chap?.form === modelFormFilter;
  });

  // AI Note Generator State
  const [aiTopic, setAiTopic] = useState('Acids, Bases and Salt Preparation');
  const [aiFocus, setAiFocus] = useState('Soluble vs Insoluble Salts & Qualitative Tests');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<any>(null);

  const handleGenerateAiNotes = async () => {
    setIsGeneratingNotes(true);
    try {
      const res = await fetch('/api/gemini/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          focusArea: aiFocus,
          difficulty: 'SPM KSSM High-Yield',
        }),
      });

      const data = await res.json();
      setGeneratedNote(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedNote({
        title: `SPM Fast Revision: ${aiTopic}`,
        summary: 'Essential concepts, balanced chemical equations, and examination traps for scoring maximum marks.',
        keyPoints: [
          'All nitrates are soluble in water (NO3-).',
          'Insoluble sulfates: PBC (Lead, Barium, Calcium sulfate).',
          'Insoluble chlorides: PAH (Lead, Silver, Mercury chloride).',
          'Insoluble salts are prepared via Double Decomposition / Precipitation reaction.',
        ],
        equations: [
          'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq) [Bright yellow ppt]',
          'BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s) + 2NaCl(aq) [White ppt]',
        ],
        observations: [
          'Cu²⁺ with excess NH₃: Royal dark blue solution [Cu(NH₃)₄]²⁺.',
          'Fe²⁺: Dirty green precipitate, oxidises to brown Fe³⁺ on standing.',
        ],
        mnemonic: '💡 PBC for Sulfates (Plumbum, Barium, Calcium are INSOLUBLE)',
        hotExamTip: 'Always write balanced ionic equations with correct state symbols (s, aq, g, l)!',
      });
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-black rounded-full border border-indigo-200 flex items-center gap-1">
              <Atom className="w-3.5 h-3.5 text-indigo-600" />
              <span>360° 3D Interactive Notes Lab</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-indigo-900 tracking-tight">
            Chemistry Smart Visual Notes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Explore 360° interactive 3D molecular geometries, apparatus setups, cation/anion precipitation tables, and AI revision mindmaps.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('3d_models')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === '3d_models' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>3D 360° Models</span>
          </button>

          <button
            onClick={() => setActiveTab('qualitative_analysis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qualitative_analysis' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cation & Anion Tests</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_note_maker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_note_maker' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>AI Note Maker 🤖</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 3D 360-Degree Interactive Models */}
      {activeTab === '3d_models' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Model Catalog Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Select 3D Diagram
              </h3>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-black">
                <button
                  type="button"
                  onClick={() => setModelFormFilter('all')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
                    modelFormFilter === 'all' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setModelFormFilter(4)}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
                    modelFormFilter === 4 ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  F4
                </button>
                <button
                  type="button"
                  onClick={() => setModelFormFilter(5)}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
                    modelFormFilter === 5 ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  F5
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredModels.map((m) => {
                const isSelected = selectedModel.id === m.id;
                const chapter = SPM_CHAPTERS.find((c) => c.id === m.chapterId);

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`w-full p-4 rounded-3xl border-2 text-left transition cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-900">{m.name}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-full">
                          {m.formula}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                        {m.description}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                        {chapter?.title} (Form {chapter?.form})
                      </span>
                    </div>

                    <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-sm ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      3D
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas & Rich Notes */}
          <div className="lg:col-span-8 space-y-6">
            <ThreeDViewer model={selectedModel} height="440px" />

            {/* Note Explanations Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-indigo-900">{selectedModel.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold">{selectedModel.formula} • {selectedModel.hybridization || 'SPM Standard Geometry'}</p>
                </div>

                {onNavigateToDrawing && (
                  <button
                    onClick={() => onNavigateToDrawing()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Practice Drawing This</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedModel.description}
              </p>

              {/* Fun Fact / SPM Exam Insight */}
              <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-2xl flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="text-xs font-black text-orange-900">SPM Concept Note:</h4>
                  <p className="text-xs text-orange-800 font-medium leading-relaxed mt-0.5">
                    {selectedModel.funFact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Qualitative Analysis (Cations & Anions Chart) */}
      {activeTab === 'qualitative_analysis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-indigo-900">
                  SPM Paper 2 & 3 Qualitative Analysis Master Chart
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Summary of precipitate colors, solubilities in excess NaOH / NH₃, and confirmatory tests.
                </p>
              </div>

              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-black rounded-full border border-orange-200">
                🔥 99% SPM Exam Frequency
              </span>
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {QUALITATIVE_TESTS.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-indigo-50/30 p-5 rounded-3xl border-2 border-indigo-50 hover:border-indigo-200 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: test.colorHex }}
                      />
                      <h4 className="text-sm font-black text-slate-800">{test.ion}</h4>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600">
                      {test.type}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <strong className="text-indigo-900">Reagent 1 (NaOH):</strong> {test.reagentNaOH}
                    </div>
                    {test.reagentNH3 !== 'N/A' && (
                      <div>
                        <strong className="text-indigo-900">Reagent 2 (NH₃):</strong> {test.reagentNH3}
                      </div>
                    )}
                    <div>
                      <strong className="text-orange-900">Confirmatory:</strong> {test.confirmatoryTest}
                    </div>
                  </div>

                  <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200 text-xs font-bold text-orange-900 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{test.mnemonic}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Smart Note Maker */}
      {activeTab === 'ai_note_maker' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-50 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-200">
              🤖
            </div>
            <div>
              <h3 className="text-lg font-black text-indigo-900">
                Dr. Molecule's AI Chemistry Note Synthesizer
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Type any SPM chemistry topic and focus area to generate a cute, high-yield revision summary with mnemonics & exam traps!
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chemistry Chapter / Topic:</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. Redox Equilibrium, Voltaic Cells, Esterification"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Focus Area / Sub-topic:</label>
              <input
                type="text"
                value={aiFocus}
                onChange={(e) => setAiFocus(e.target.value)}
                placeholder="e.g. Standard Electrode Potential E0 and Electron Flow"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateAiNotes}
              disabled={isGeneratingNotes}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingNotes ? 'animate-spin' : ''}`} />
              <span>{isGeneratingNotes ? 'Synthesizing Notes...' : 'Generate SPM Revision Note'}</span>
            </button>
          </div>

          {/* Generated Note Output */}
          {generatedNote && (
            <div className="p-6 bg-indigo-50/40 border-2 border-indigo-100 rounded-3xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <h4 className="text-base font-black text-indigo-900">{generatedNote.title}</h4>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                  AI Revision Card
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {generatedNote.summary}
              </p>

              {/* Key Points */}
              {generatedNote.keyPoints?.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Key Exam Points:</h5>
                  <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc font-medium">
                    {generatedNote.keyPoints.map((pt: string, i: number) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Equations */}
              {generatedNote.equations?.length > 0 && (
                <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chemical Equations:</span>
                  {generatedNote.equations.map((eq: string, i: number) => (
                    <div key={i}>{eq}</div>
                  ))}
                </div>
              )}

              {/* Mnemonic & Tip */}
              {generatedNote.mnemonic && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-xs font-bold text-orange-900 flex items-center gap-2">
                  <span>💡</span>
                  <span>{generatedNote.mnemonic}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
