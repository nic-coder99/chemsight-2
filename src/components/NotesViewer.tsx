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

const HIGH_YIELD_SPM_TOPICS = [
  {
    id: 'salts',
    chapter: 'Form 4: Acids, Bases & Salts',
    title: 'Solubility Rules & Double Decomposition',
    summary: 'Rules for soluble/insoluble salts and preparation methods required in SPM Paper 2 & Paper 3.',
    keyPoints: [
      'All NO₃⁻ (Nitrates) are SOLUBLE in water.',
      'Insoluble Sulfates: PBC — Lead(II) sulfate (PbSO₄), Barium sulfate (BaSO₄), Calcium sulfate (CaSO₄).',
      'Insoluble Chlorides: PAH — Lead(II) chloride (PbCl₂), Silver chloride (AgCl), Mercury chloride (Hg₂Cl₂).',
      'Soluble Carbonates: SPA — Sodium (Na₂CO₃), Potassium (K₂CO₃), Ammonium ((NH₄)₂CO₃). All other carbonates are insoluble.',
      'Insoluble salt preparation: Precipitation / Double decomposition method (mix 2 soluble aqueous solutions).',
    ],
    equations: [
      'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)  [Yellow precipitate]',
      'Ba(NO₃)₂(aq) + Na₂SO₄(aq) → BaSO₄(s) + 2NaNO₃(aq)  [White precipitate]',
      'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)  [White precipitate]',
    ],
    mnemonic: '💡 PBC for Sulfates (Plumbum, Barium, Calcium) & PAH for Chlorides (Plumbum, Aurum/Silver, Hydrargyrum)',
  },
  {
    id: 'redox',
    chapter: 'Form 5: Redox Equilibrium',
    title: 'Standard Electrode Potential & Cell Voltage',
    summary: 'Determining anode/cathode terminals, electron flow direction, and calculating E°cell.',
    keyPoints: [
      'More positive E° value: Undergoes reduction (acts as Cathode / Positive terminal).',
      'More negative E° value: Undergoes oxidation (acts as Anode / Negative terminal).',
      'Electron flow: Anode (negative terminal) → Cathode (positive terminal) through the external connecting wire.',
      'Standard cell potential formula: E°cell = E°cathode - E°anode.',
      'Reaction is spontaneous when E°cell > 0 V.',
    ],
    equations: [
      'Anode (Oxidation): Zn(s) → Zn²⁺(aq) + 2e⁻  [E° = -0.76 V]',
      'Cathode (Reduction): Cu²⁺(aq) + 2e⁻ → Cu(s)  [E° = +0.34 V]',
      'Overall: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)  [E°cell = +0.34 - (-0.76) = +1.10 V]',
    ],
    mnemonic: '💡 AN OX & RED CAT: Anode = Oxidation, Reduction = Cathode. OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons.',
  },
  {
    id: 'thermochem',
    chapter: 'Form 5: Thermochemistry',
    title: 'Heat of Precipitation & Neutralisation',
    summary: 'Standard energy level diagrams, heat released (Q = mcθ), and molar heat calculations (ΔH).',
    keyPoints: [
      'Exothermic reaction: ΔH is negative (-). Temperature of surroundings rises.',
      'Endothermic reaction: ΔH is positive (+). Temperature of surroundings drops.',
      'Step 1: Calculate heat change Q = m × c × θ (where m = total volume in cm³ = mass in g, c = 4.2 J g⁻¹ °C⁻¹).',
      'Step 2: Calculate number of moles n = (M × V) / 1000.',
      'Step 3: Calculate Heat of reaction ΔH = ±(Q / n) / 1000 in kJ mol⁻¹.',
      'Strong acid + strong alkali gives constant ΔH ≈ -57.3 kJ mol⁻¹ (H⁺ + OH⁻ → H₂O).',
      'Weak acid/alkali releases less heat because part of the heat energy is absorbed to completely ionise the undissociated molecules.',
    ],
    equations: [
      'H⁺(aq) + OH⁻(aq) → H₂O(l)  [ΔH = -57.3 kJ mol⁻¹]',
      'Q = mcθ   |   n = (M × V) / 1000   |   ΔH = -(Q / n) kJ mol⁻¹',
    ],
    mnemonic: '💡 EXO releases heat (bonds forming, EXIT), ENDO absorbs heat (bonds breaking, ENTER).',
  },
  {
    id: 'organic',
    chapter: 'Form 5: Carbon Compounds',
    title: 'Homologous Series, Esterification & Isomers',
    summary: 'Functional groups, chemical properties, and IUPAC nomenclature rules for SPM Paper 2 Section B/C.',
    keyPoints: [
      'Alkanes: CnH2n+2 (Single covalent bonds, substitution with UV light).',
      'Alkenes: CnH2n (C=C double bond, addition reactions, decolourises brown bromine water).',
      'Alcohols: CnH2n+1OH (Hydroxyl group -OH, combustion, oxidation by acidified K₂Cr₂O₇ to form carboxylic acids).',
      'Carboxylic Acids: CnH2n+1COOH (Carboxyl group -COOH, reacts with metals, carbonates, bases).',
      'Esters: Alcohol + Carboxylic acid (in presence of concentrated H₂SO₄ catalyst) → Ester + Water. Sweet fruity smell.',
    ],
    equations: [
      'C₂H₅OH + CH₃COOH ⇌ [conc. H₂SO₄, reflux] CH₃COOC₂H₅ (Ethyl ethanoate) + H₂O',
      'C₂H₅OH + 2[O] → [acidified KMnO₄/H⁺] CH₃COOH + H₂O',
    ],
    mnemonic: '💡 Ester naming: Alcohol gives alkyl first-part (Ethanol → Ethyl), Acid gives second-part (Ethanoic acid → ethanoate).',
  },
];

export const NotesViewer: React.FC<NotesViewerProps> = ({
  initialModelId,
  onNavigateToDrawing,
}) => {
  const [selectedModel, setSelectedModel] = useState<Model3DData>(
    MODELS_3D.find((m) => m.id === initialModelId) || MODELS_3D[0]
  );
  const [activeTab, setActiveTab] = useState<'3d_models' | 'qualitative_analysis' | 'spm_formulas'>('3d_models');
  const [modelFormFilter, setModelFormFilter] = useState<'all' | 4 | 5>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('salts');

  // Filtered 3D Models
  const filteredModels = MODELS_3D.filter((m) => {
    if (modelFormFilter === 'all') return true;
    const chap = SPM_CHAPTERS.find((c) => c.id === m.chapterId);
    return chap?.form === modelFormFilter;
  });

  const activeTopic = HIGH_YIELD_SPM_TOPICS.find((t) => t.id === selectedTopicId) || HIGH_YIELD_SPM_TOPICS[0];

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
            Explore 360° interactive 3D molecular geometries, apparatus setups, cation/anion precipitation tables, and high-yield SPM revision guides.
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
            onClick={() => setActiveTab('spm_formulas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'spm_formulas' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>SPM High-Yield Notes</span>
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

      {/* Tab 3: SPM High-Yield Notes & Formula Guide */}
      {activeTab === 'spm_formulas' && (
        <div className="space-y-6">
          {/* Topic Pills */}
          <div className="flex flex-wrap gap-2">
            {HIGH_YIELD_SPM_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  selectedTopicId === topic.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{topic.title}</span>
              </button>
            ))}
          </div>

          {/* Active Topic Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-50 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-full">
                  {activeTopic.chapter}
                </span>
                <h3 className="text-xl font-black text-indigo-900 mt-1">
                  {activeTopic.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">SPM KSSM Syllabus Standard</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {activeTopic.summary}
            </p>

            {/* Key Exam Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Key Exam Marking Points:</span>
              </h4>
              <ul className="space-y-2 pl-2">
                {activeTopic.keyPoints.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-700 font-medium flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chemical Equations */}
            <div className="p-4 bg-slate-900 text-indigo-200 font-mono text-xs rounded-2xl space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Standard SPM Equations & Calculations:
              </span>
              {activeTopic.equations.map((eq, i) => (
                <div key={i} className="text-emerald-300 font-semibold tracking-wide bg-slate-800/80 p-2 rounded-lg">
                  {eq}
                </div>
              ))}
            </div>

            {/* Mnemonic & Trap Warning */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2.5 shadow-2xs">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{activeTopic.mnemonic}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
