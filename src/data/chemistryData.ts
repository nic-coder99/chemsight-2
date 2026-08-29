import {
  SPMChapter,
  Question,
  DrawingChallenge,
  Model3DData,
  QualitativeTestItem,
  ClassroomRoom,
  RoomExercise,
  HomeworkSubmission,
  MacroWeakTopic,
} from '../types';

export const SPM_CHAPTERS: SPMChapter[] = [
  {
    id: 'f4_c2',
    title: 'Matter & Atomic Structure',
    titleBM: 'Jirim dan Struktur Atom',
    form: 4,
    icon: '⚛️',
    hotProbability: 92,
    hotReason: 'High frequency in SPM Paper 2: Heating & cooling curve of naphthalene, subatomic particle calculation, and electron arrangement drawings.',
    color: 'from-amber-400 to-orange-500',
    totalQuestions: 12,
  },
  {
    id: 'f4_c3',
    title: 'Mole Concept & Chemical Equations',
    titleBM: 'Konsep Mol, Formula dan Persamaan Kimia',
    form: 4,
    icon: '⚖️',
    hotProbability: 96,
    hotReason: 'Core fundamental for SPM: Empirical formula determination of MgO vs CuO, stoichiometry calculation & gas volume at STP/room conditions.',
    color: 'from-blue-400 to-indigo-500',
    totalQuestions: 14,
  },
  {
    id: 'f4_c4',
    title: 'Periodic Table of Elements',
    titleBM: 'Jadual Berkala Unsur',
    form: 4,
    icon: '🧪',
    hotProbability: 88,
    hotReason: 'Reactivity trends down Group 1 with water/oxygen, Group 17 displacement & halogen color changes, and transition elements catalytic properties.',
    color: 'from-emerald-400 to-teal-500',
    totalQuestions: 10,
  },
  {
    id: 'f4_c5',
    title: 'Chemical Bonds',
    titleBM: 'Ikatan Kimia',
    form: 4,
    icon: '🔗',
    hotProbability: 94,
    hotReason: 'Formation of ionic vs covalent bonds, electron sharing/transfer diagrams, and new KSSM syllabus focus on Hydrogen bonds & Dative bonds.',
    color: 'from-pink-400 to-rose-500',
    totalQuestions: 12,
  },
  {
    id: 'f4_c6',
    title: 'Acids, Bases and Salts',
    titleBM: 'Asid, Bes dan Garam',
    form: 4,
    icon: '🧂',
    hotProbability: 99,
    hotReason: '🔥🔥 TOP HOT TOPIC! Preparation of soluble & insoluble salts, titration calculation, and qualitative analysis of cations/anions in Paper 2 & 3.',
    color: 'from-purple-400 to-violet-600',
    totalQuestions: 18,
  },
  {
    id: 'f4_c7',
    title: 'Rate of Reaction',
    titleBM: 'Kadar Tindak Balas',
    form: 4,
    icon: '⚡',
    hotProbability: 90,
    hotReason: 'Collision theory graph interpretation, effect of concentration/catalyst/temperature on gradient, and calculating rate of reaction at t seconds.',
    color: 'from-yellow-400 to-amber-500',
    totalQuestions: 11,
  },
  {
    id: 'f5_c1',
    title: 'Redox Equilibrium',
    titleBM: 'Keseimbangan Redoks',
    form: 5,
    icon: '🔋',
    hotProbability: 98,
    hotReason: '🔥🔥 TOP PREDICTION! Simple Chemical Cell vs Electrolytic Cell, Standard Electrode Potential ($E^0$), Rusting mechanism & sacrificial protection.',
    color: 'from-cyan-400 to-blue-600',
    totalQuestions: 16,
  },
  {
    id: 'f5_c2',
    title: 'Carbon Compounds',
    titleBM: 'Sebatian Karbon',
    form: 5,
    icon: '🌿',
    hotProbability: 97,
    hotReason: 'Homologous series, structural isomers, preparation & naming of Esters (sweet fruity smell), oxidation of alcohol to carboxylic acid.',
    color: 'from-green-400 to-emerald-600',
    totalQuestions: 15,
  },
  {
    id: 'f5_c3',
    title: 'Thermochemistry',
    titleBM: 'Termokimia',
    form: 5,
    icon: '🔥',
    hotProbability: 93,
    hotReason: 'Energy profile diagrams ($ΔH$), Heat of Neutralisation ($HCl + NaOH$ vs weak acid), and Heat of Precipitation calculation ($q = mcΔθ$).',
    color: 'from-red-400 to-rose-600',
    totalQuestions: 12,
  },
  {
    id: 'f5_c4',
    title: 'Polymer Chemistry',
    titleBM: 'Kimia Polimer',
    form: 5,
    icon: '🧶',
    hotProbability: 82,
    hotReason: 'Addition vs condensation polymerisation, vulcanised rubber properties (sulfur cross-links) vs unvulcanised natural rubber.',
    color: 'from-teal-400 to-emerald-500',
    totalQuestions: 8,
  },
  {
    id: 'f5_c5',
    title: 'Consumer & Industrial Chemistry',
    titleBM: 'Kimia Konsumer dan Industri',
    form: 5,
    icon: '🧼',
    hotProbability: 85,
    hotReason: 'Cleansing action of soap vs detergent in hard water ($Ca^{2+}, Mg^{2+}$ ions scum formation), food additives, and green chemistry.',
    color: 'from-sky-400 to-indigo-500',
    totalQuestions: 9,
  },
];

export const SPM_QUESTIONS: Question[] = [
  // 1. F4 C6 - Acid, Base & Salt (SUPER HOT 2026)
  {
    id: 'q_salt_01',
    chapterId: 'f4_c6',
    paperType: 'Paper 2 (Structured)',
    isHot2026: true,
    hotRating: 99,
    hotTagText: '🔥 2026 Target: Salt Preparation',
    questionText: 'A student wants to prepare Lead(II) sulfate, PbSO₄ salt in the school laboratory. Which pair of aqueous solutions is the most suitable for this preparation method?',
    questionTextBM: 'Seorang murid ingin menyediakan garam plumbum(II) sulfat, PbSO₄ di makmal sekolah. Pasangan larutan akues manakah yang paling sesuai untuk kaedah penyediaan ini?',
    options: [
      'Lead(II) nitrate solution, Pb(NO₃)₂ and Sodium sulfate solution, Na₂SO₄',
      'Lead metal, Pb and dilute sulfuric acid, H₂SO₄',
      'Lead(II) oxide powder, PbO and dilute sulfuric acid, H₂SO₄',
      'Lead(II) carbonate powder, PbCO₃ and dilute sulfuric acid, H₂SO₄'
    ],
    correctAnswer: 0,
    explanation: 'Lead(II) sulfate (PbSO₄) is an INSOLUBLE salt (PBC - PbSO4, BaSO4, CaSO4 are insoluble sulfates). Insoluble salts MUST be prepared by the Double Decomposition / Precipitation reaction using TWO SOLUBLE aqueous solutions (e.g. Pb(NO₃)₂ + Na₂SO₄ → PbSO₄ (s) + 2NaNO₃). Reactions with Pb metal/oxide/carbonate and H₂SO₄ form an insoluble PbSO₄ protective layer that stops further reaction!',
    stepByStepSolution: [
      'Step 1: Identify if the salt is soluble or insoluble. PbSO₄ is an insoluble sulfate (Mnemonic: PBC - Plumbum, Barium, Calsium sulfates are insoluble!).',
      'Step 2: Choose preparation method: Insoluble salt = Precipitation / Double Decomposition reaction.',
      'Step 3: Required reagents = Soluble salt solution A (all Nitrates are soluble, so Pb(NO₃)₂) + Soluble salt solution B (Na₂SO₄ or K₂SO₄).',
      'Step 4: Avoid reacting Pb, PbO, or PbCO₃ with H₂SO₄ because the insoluble PbSO₄ crust coats the reactant and halts the reaction.'
    ],
    keyMnemonic: '💡 Sulfates Insoluble Mnemonic: PBC (Plumbum, Barium, Calcium) are insoluble in water!',
    commonMistakes: 'Choosing Pb metal + H2SO4 or PbO + H2SO4. Students forget that the insoluble PbSO4 coat stops the reaction halfway!',
    formulaOrEquation: 'Pb(NO₃)₂(aq) + Na₂SO₄(aq) → PbSO₄(s) + 2NaNO₃(aq)',
    marks: 2,
    difficulty: 'KBAT (HOTS)',
    relatedModel3DId: 'titration_apparatus',
  },
  // 2. F5 C1 - Redox (SUPER HOT 2026)
  {
    id: 'q_redox_01',
    chapterId: 'f5_c1',
    paperType: 'Paper 1 (MCQ)',
    isHot2026: true,
    hotRating: 98,
    hotTagText: '🔥 2026 Target: Voltaic Cell & E0 Values',
    questionText: 'Given the standard electrode potential values: E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V. When a chemical cell is constructed using Zinc and Copper electrodes in their respective nitrate solutions with a porous pot:',
    options: [
      'Zinc acts as the negative terminal (anode) and undergoes oxidation: Zn → Zn²⁺ + 2e⁻',
      'Copper electrode dissolves and becomes thinner over time',
      'Electrons flow through the external circuit from Copper to Zinc',
      'The blue color of the copper(II) sulfate electrolyte becomes darker'
    ],
    correctAnswer: 0,
    explanation: 'Zinc has a more negative E° value (-0.76 V) compared to Copper (+0.34 V), so Zinc has a higher tendency to release electrons (oxidation) and acts as the Negative Terminal (Anode). Cu²⁺ ions receive electrons at the positive cathode (reduction: Cu²⁺ + 2e⁻ → Cu) depositing brown solid.',
    stepByStepSolution: [
      'Step 1: Compare E° values. More negative E° = Stronger reducing agent, releases electrons easily = Negative Terminal (Anode).',
      'Step 2: Oxidation at Anode (Zn): Zn(s) → Zn²⁺(aq) + 2e⁻. Zinc electrode becomes thinner.',
      'Step 3: Electrons flow from Negative terminal (Zn) to Positive terminal (Cu) through the external wire.',
      'Step 4: Reduction at Cathode (Cu): Cu²⁺(aq) + 2e⁻ → Cu(s). Blue Cu²⁺ color fades to pale blue.'
    ],
    keyMnemonic: '💡 An Ox Red Cat: Anode = Oxidation, Reduction = Cathode. OIL RIG: Oxidation Is Loss, Reduction Is Gain.',
    commonMistakes: 'Confusing electron flow direction (electrons ALWAYS flow from negative terminal to positive terminal in a voltaic cell).',
    formulaOrEquation: 'Overall: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), E°cell = +0.34 - (-0.76) = +1.10 V',
    marks: 1,
    difficulty: 'Medium',
    relatedModel3DId: 'voltaic_cell',
  },
  // 3. F5 C2 - Carbon Compounds (Esterification)
  {
    id: 'q_carbon_01',
    chapterId: 'f5_c2',
    paperType: 'Paper 2 (Structured)',
    isHot2026: true,
    hotRating: 96,
    hotTagText: '🔥 2026 Target: Esterification Reaction',
    questionText: 'Ethanol, C₂H₅OH reacts with Ethanoic acid, CH₃COOH in the presence of concentrated sulfuric acid as a catalyst under reflux. What is the IUPAC name and pleasant physical property of the product formed?',
    options: [
      'Ethyl ethanoate; Sweet fruity smell and insoluble in water (forms oily layer)',
      'Methyl ethanoate; Pungent vinegar smell and dissolves in water',
      'Ethyl methanoate; Colorless gas that turns damp litmus red',
      'Diethyl ether; Sweet pungent flammable gas'
    ],
    correctAnswer: 0,
    explanation: 'Alcohol (Ethanol → ethyl group) + Carboxylic acid (Ethanoic acid → ethanoate group) forms the ester Ethyl ethanoate (CH₃COOC₂H₅) and water. Esters have characteristic sweet, pleasant fruity smells, are less dense than water, and form a distinct floating oily layer.',
    stepByStepSolution: [
      'Step 1: Identify the alcohol and carboxylic acid: Ethanol (C₂H₅OH) + Ethanoic acid (CH₃COOH).',
      'Step 2: Ester naming rule: [Alkyl from alcohol] + [Alkanoate from acid] = Ethyl ethanoate.',
      'Step 3: Role of concentrated H₂SO₄ = Catalyst and dehydrating agent.',
      'Step 4: Observation: Pleasant sweet fruity aroma with two immiscible liquid layers.'
    ],
    keyMnemonic: '💡 Ester Rule: Alcohol gives the first name (Alkyl), Acid gives the last name (Alkanoate)!',
    commonMistakes: 'Naming the ester backwards as "Ethanoic ethyl" or forgetting that water is also produced in condensation!',
    formulaOrEquation: 'CH₃COOH(l) + C₂H₅OH(l) ⇌ (conc. H₂SO₄) ⇌ CH₃COOC₂H₅(l) + H₂O(l)',
    marks: 2,
    difficulty: 'Medium',
    relatedModel3DId: 'ethanol',
  },
  // 4. F4 C2 - Atomic Structure (Heating curve & Electron Shells)
  {
    id: 'q_atom_01',
    chapterId: 'f4_c2',
    paperType: 'Paper 1 (MCQ)',
    isHot2026: true,
    hotRating: 92,
    hotTagText: '🔥 2026 Target: Heating Curve & Latent Heat',
    questionText: 'During the heating of solid naphthalene until it melts completely, why does the temperature remain constant at 80°C along the melting plateau region?',
    options: [
      'Heat energy absorbed is used to overcome the attractive forces between particles, not to increase kinetic energy',
      'Heat energy is lost to the surrounding faster than it is absorbed',
      'The naphthalene particles stop moving completely during phase change',
      'The thermometer calibration reaches its maximum capacity'
    ],
    correctAnswer: 0,
    explanation: 'During melting (phase change from solid to liquid), the heat energy absorbed from the water bath is fully utilized to weaken/overcome the intermolecular forces of attraction between naphthalene particles so that particles can slide past one another. Because kinetic energy does NOT increase, the temperature remains constant.',
    stepByStepSolution: [
      'Step 1: Recall definition of Temperature: Measure of average kinetic energy of particles.',
      'Step 2: At constant temperature (plateau): Kinetic energy remains unchanged.',
      'Step 3: State where the heat energy goes: "Heat energy absorbed is used to overcome forces of attraction between particles to change state from solid to liquid".'
    ],
    keyMnemonic: '💡 SPM Keyword Mantra: "Heat absorbed used to OVERCOME forces between particles, kinetic energy remains CONSTANT".',
    commonMistakes: 'Writing "heat energy is lost to surrounding" or "bonds are broken" instead of "forces of attraction are overcome".',
    marks: 1,
    difficulty: 'Easy',
    relatedModel3DId: 'bohr_atom',
  },
  // 5. F4 C5 - Chemical Bond (Covalent vs Ionic)
  {
    id: 'q_bond_01',
    chapterId: 'f4_c5',
    paperType: 'Paper 2 (Structured)',
    isHot2026: true,
    hotRating: 94,
    hotTagText: '🔥 2026 Target: Giant Lattice vs Simple Molecule',
    questionText: 'Why does Sodium chloride (NaCl) have a much higher melting point (801°C) compared to Tetrachloromethane (CCl₄, -23°C)?',
    options: [
      'NaCl has a giant ionic lattice held by strong electrostatic forces of attraction between opposite ions, whereas CCl₄ has simple covalent molecules with weak van der Waals forces',
      'NaCl has strong covalent bonds inside its molecules that require huge energy to break',
      'CCl₄ has ionic bonds that dissolve easily at room temperature',
      'Sodium is a reactive Group 1 metal with high nuclear charge'
    ],
    correctAnswer: 0,
    explanation: 'Sodium chloride has a giant ionic lattice structure with strong electrostatic forces between Na⁺ and Cl⁻ ions, which require large amounts of heat energy to overcome. CCl₄ consists of simple covalent molecules held together by weak intermolecular van der Waals forces, requiring very little heat to separate.',
    stepByStepSolution: [
      'Step 1: State structure type for NaCl = Giant ionic lattice.',
      'Step 2: State attraction for NaCl = Strong electrostatic forces between Na⁺ and Cl⁻ ions.',
      'Step 3: State structure type for CCl₄ = Simple covalent molecule.',
      'Step 4: State attraction for CCl₄ = Weak intermolecular forces (van der Waals forces).',
      'Step 5: Conclude energy required: Much more heat energy required to overcome strong electrostatic attraction in NaCl.'
    ],
    keyMnemonic: '💡 Structure vs Forces: Ionic = Electrostatic forces between ions. Covalent simple = Intermolecular van der Waals forces between molecules.',
    commonMistakes: 'Saying "covalent bonds between atoms in CCl4 are broken during melting" — only weak intermolecular forces are broken, NOT the covalent bonds!',
    marks: 3,
    difficulty: 'Medium',
    relatedModel3DId: 'nacl_lattice',
  },
  // 6. F5 C3 - Thermochemistry (Heat of Neutralisation)
  {
    id: 'q_thermo_01',
    chapterId: 'f5_c3',
    paperType: 'Paper 2 (Structured)',
    isHot2026: true,
    hotRating: 93,
    hotTagText: '🔥 2026 Target: Heat of Neutralisation Comparison',
    questionText: 'The heat of neutralisation between strong acid (HCl) and strong alkali (NaOH) is -57.3 kJ/mol. When weak ethanoic acid (CH₃COOH) is neutralised with NaOH, the heat released is only -55.0 kJ/mol. Why is the heat of neutralisation for weak acid lower?',
    options: [
      'Ethanoic acid ionises partially in water; part of the heat energy released is absorbed to completely ionise the undissociated acid molecules',
      'Ethanoic acid has fewer hydrogen atoms than hydrochloric acid',
      'The reaction is endothermic so it absorbs temperature from the calorimeter',
      'Weak acid forms insoluble salt precipitate that traps heat'
    ],
    correctAnswer: 0,
    explanation: 'Ethanoic acid is a weak monobasic acid that ionises only partially in aqueous solution to produce a low concentration of H⁺ ions. Some of the heat energy released during the neutralisation reaction is re-absorbed to completely ionise/dissociate the remaining unionised CH₃COOH molecules into CH₃COO⁻ and H⁺ ions.',
    stepByStepSolution: [
      'Step 1: Define weak acid: Ionises partially in water to produce low concentration of H⁺ ions, mostly remaining as unionised molecules.',
      'Step 2: Explain energy consumption: Energy is required to break O-H bonds to completely dissociate remaining molecules.',
      'Step 3: State overall heat: Therefore, net heat of neutralisation is lower than theoretical -57.3 kJ/mol for strong acid-strong base.'
    ],
    keyMnemonic: '💡 Weak Acid Penalty: "Part of heat released is absorbed to fully ionise the weak acid molecules".',
    commonMistakes: 'Confusing weak acid with dilute acid. Weak refers to degree of ionisation, not concentration!',
    formulaOrEquation: 'H⁺(aq) + OH⁻(aq) → H₂O(l), ΔH = -57.3 kJ mol⁻¹ (standard strong neutralisation)',
    marks: 2,
    difficulty: 'KBAT (HOTS)',
  },
  // 7. F4 C6 - Qualitative Analysis (Cations & Anions)
  {
    id: 'q_qual_01',
    chapterId: 'f4_c6',
    paperType: 'Paper 3 (Practical)',
    isHot2026: true,
    hotRating: 98,
    hotTagText: '🔥 2026 Target: Cation Identification (NaOH & NH3)',
    questionText: 'When Sodium hydroxide (NaOH) solution is added dropwise until in excess to unknown salt solution X, a white precipitate is formed which dissolves in excess NaOH to form a colorless solution. When aqueous Ammonia (NH₃) is added dropwise until in excess to solution X, a white precipitate is formed which is INSOLUBLE in excess NH₃. Which cation is present in solution X?',
    options: [
      'Lead(II) ion, Pb²⁺ or Aluminium ion, Al³⁺',
      'Zinc ion, Zn²⁺',
      'Magnesium ion, Mg²⁺',
      'Copper(II) ion, Cu²⁺'
    ],
    correctAnswer: 0,
    explanation: 'White ppt soluble in excess NaOH: ZAP (Zn²⁺, Al³⁺, Pb²⁺). White ppt insoluble in excess NH₃: Al³⁺, Pb²⁺, Mg²⁺. The intersection of both tests leaves Pb²⁺ and Al³⁺! (Zn²⁺ dissolves in excess NH₃, while Mg²⁺ does not dissolve in excess NaOH). A confirmatory test with Potassium iodide (KI) gives yellow ppt for Pb²⁺.',
    stepByStepSolution: [
      'Step 1: Test with NaOH excess: White precipitate dissolves in excess NaOH = Zn²⁺, Al³⁺, or Pb²⁺ (Mnemonic: ZAP dissolves in NaOH).',
      'Step 2: Test with NH₃ excess: White precipitate INSOLUBLE in excess NH₃ = Al³⁺, Pb²⁺, Mg²⁺ (Zn²⁺ dissolves in excess NH₃ to form colorless complex).',
      'Step 3: Compare both: Cations satisfying both conditions are Pb²⁺ and Al³⁺.',
      'Step 4: Confirmatory test: Add KI solution. Pb²⁺ forms yellow precipitate of PbI₂ (which dissolves in hot water and recrystallizes into shiny golden crystals upon cooling).'
    ],
    keyMnemonic: '💡 ZAP in NaOH: Zinc, Aluminium, Plumbum dissolve in excess NaOH. Only Zinc dissolves in excess NH₃ (Z in NH3)!',
    commonMistakes: 'Picking Zinc ion (Zn2+) without remembering that Zinc dissolves in BOTH excess NaOH and excess NH3!',
    marks: 3,
    difficulty: 'Hard',
    relatedModel3DId: 'titration_apparatus',
  },
  // 8. F4 C4 - Periodic Table Group 1 Reactivity
  {
    id: 'q_pt_01',
    chapterId: 'f4_c4',
    paperType: 'Paper 1 (MCQ)',
    isHot2026: true,
    hotRating: 89,
    hotTagText: '🔥 2026 Target: Group 1 Reactivity Trend',
    questionText: 'Why does Potassium (K) react more vigorously and rapidly with cold water compared to Sodium (Na) and Lithium (Li)?',
    options: [
      'Potassium has a larger atomic radius; its valence electron is further away from the nucleus and experiences weaker attraction, making it easier to be donated',
      'Potassium has more protons, which push the valence electrons away with stronger positive repulsion',
      'Potassium has a higher electronegativity and pulls electrons from water faster',
      'Potassium solid floats on water while sodium sinks'
    ],
    correctAnswer: 0,
    explanation: 'Going down Group 1 (Li → Na → K), the number of filled electron shells increases, resulting in a larger atomic radius and increased screening/shielding effect. The single valence electron is situated further from the positive nucleus, so the electrostatic attraction from the nucleus is weaker, allowing Potassium to release its valence electron more easily to achieve a stable octet.',
    stepByStepSolution: [
      'Step 1: State atomic radius change down Group 1: Increases (more electron shells).',
      'Step 2: State shielding effect: Increases.',
      'Step 3: State attraction on valence electron: Electrostatic attraction between nucleus and valence electron becomes WEAKER.',
      'Step 4: Conclude: Easier for Potassium atom to donate its single valence electron to form K⁺ ion.'
    ],
    keyMnemonic: '💡 Group 1 reactivity: Bigger atom = Weaker grip on outer electron = MORE reactive!',
    commonMistakes: 'Saying "potassium has more protons so it attracts more" — in metals, reactivity depends on losing electrons easily!',
    formulaOrEquation: '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g) (Ignites with lilac flame)',
    marks: 2,
    difficulty: 'Medium',
    relatedModel3DId: 'bohr_atom',
  },
  // 9. SPM Paper 2 HOT DRAWING: CCl4 Covalent Bond Formation (Exam Classic!)
  {
    id: 'q_draw_ccl4',
    chapterId: 'f4_c5',
    paperType: 'Paper 2 (Structured)',
    questionType: 'drawing_bond',
    isHot2026: true,
    hotRating: 99,
    hotTagText: '🔥 2026 HOT EXAM DRAWING: Covalent Bond Formation (CCl₄)',
    questionText: 'Carbon (proton number = 6) and Chlorine (proton number = 17) react to form Tetrachloromethane, CCl₄. Draw the electron arrangement diagram showing the sharing of electrons in one CCl₄ molecule. (Show only valence electrons or all electron shells).',
    questionTextBM: 'Karbon (nombor proton = 6) dan Klorin (nombor proton = 17) bertindak balas membentuk Tetraklorometana, CCl₄. Lukis rajah susunan elektron yang menunjukkan perkongsian elektron dalam satu molekul CCl₄.',
    correctAnswer: 'CCl4_OCTET_DRAWING',
    drawingBondType: 'covalent',
    drawingTargetFormula: 'CCl₄ (Tetrachloromethane)',
    drawingExpectedElements: [
      'Central Carbon atom sharing 1 pair of electrons with each of 4 Chlorine atoms',
      '4 single covalent bonds formed (total 4 shared pairs: • ✕)',
      'Carbon achieves stable octet electron arrangement (8 electrons)',
      'Each of 4 Chlorine atoms has 6 non-bonding valence electrons (3 lone pairs) + 1 shared pair = 8 electrons (octet)',
      'Label: CCl₄ or Tetraklorometana'
    ],
    drawingHint: 'Place C in center, surrounded by 4 Cl atoms. Overlap each C-Cl shell with 1 pair of shared electrons (1 dot + 1 cross). Do not forget the remaining 6 valence electrons on each Chlorine atom!',
    drawingPresetStamps: ['C', 'Cl', '•', '✕', 'Covalent Shell', 'Single Bond', 'Lone Pair'],
    explanation: 'Carbon atom has electron arrangement 2.4 (needs 4 electrons for octet). Chlorine atom has electron arrangement 2.8.7 (needs 1 electron for octet). One Carbon atom contributes 4 valence electrons to be shared with 4 Chlorine atoms, forming 4 single covalent bonds in CCl₄.',
    stepByStepSolution: [
      'Step 1: Write electron arrangements: C = 2.4 (valence = 4), Cl = 2.8.7 (valence = 7).',
      'Step 2: Determine sharing: 1 Carbon atom shares 4 pairs of electrons with 4 Chlorine atoms.',
      'Step 3: Draw central C atom with 4 outer overlapping Cl shells.',
      'Step 4: Place 1 shared pair (• ✕) in each of the 4 overlap regions.',
      'Step 5: CRITICAL EXAM MARK: Draw the 6 unshared valence electrons on EACH Chlorine atom (3 lone pairs each)! Carbon and all 4 Chlorine atoms now achieve stable octet 2.8 / 2.8.8.'
    ],
    keyMnemonic: '💡 Exam Trap: Forgetting the 6 outer non-bonding electrons on each Chlorine atom loses 1 full mark in SPM!',
    commonMistakes: 'Leaving Chlorine with only the shared pair without drawing its other 6 valence electrons.',
    formulaOrEquation: 'C + 4Cl → CCl₄ (4 Single Covalent Bonds)',
    marks: 3,
    difficulty: 'KBAT (HOTS)',
    relatedModel3DId: 'methane',
  },
  // 10. SPM Paper 2 HOT DRAWING: MgCl2 Ionic Bond Formation (Electron Transfer)
  {
    id: 'q_draw_mgcl2',
    chapterId: 'f4_c5',
    paperType: 'Paper 2 (Structured)',
    questionType: 'drawing_bond',
    isHot2026: true,
    hotRating: 97,
    hotTagText: '🔥 2026 HOT EXAM DRAWING: Ionic Bond Formation (MgCl₂)',
    questionText: 'Magnesium (proton number = 12) reacts with Chlorine (proton number = 17) to form Magnesium chloride, MgCl₂. Draw the electron arrangement diagram of the ionic compound formed, showing square brackets and ion charges.',
    questionTextBM: 'Magnesium (nombor proton = 12) bertindak balas dengan Klorin (nombor proton = 17) membentuk Magnesium klorida, MgCl₂. Lukis rajah susunan elektron bagi sebatian ion yang terbentuk dengan kurungan segi empat tepat dan cas ion.',
    correctAnswer: 'MGCL2_IONIC_DRAWING',
    drawingBondType: 'ionic',
    drawingTargetFormula: 'MgCl₂ (Magnesium Chloride)',
    drawingExpectedElements: [
      'One Mg²⁺ ion in square brackets [Mg]²⁺ with electron arrangement 2.8 (octet)',
      'Two Cl⁻ ions in square brackets 2[Cl]⁻ with electron arrangement 2.8.8 (octet)',
      'Transferred electrons shown with distinct symbols (dots and crosses)',
      'Correct ion charges: +2 on Magnesium and -1 on Chloride'
    ],
    drawingHint: 'Magnesium atom (2.8.2) transfers 2 valence electrons (one to each Chlorine atom). Draw [Mg]²⁺ (2.8) and 2[Cl]⁻ (2.8.8) with square brackets and charges!',
    drawingPresetStamps: ['Mg²⁺', 'Cl⁻', '[ ]', '•', '✕', '2[Cl]⁻', 'Ionic Shell'],
    explanation: 'One Magnesium atom (2.8.2) donates 2 valence electrons to two Chlorine atoms (2.8.7). Magnesium becomes a Magnesium ion, Mg²⁺ (2.8) with +2 charge. Each Chlorine atom accepts 1 electron to become a Chloride ion, Cl⁻ (2.8.8) with -1 charge. Held by strong electrostatic forces.',
    stepByStepSolution: [
      'Step 1: Write electron arrangements: Mg = 2.8.2, Cl = 2.8.7.',
      'Step 2: Mg donates 2 electrons: Mg → Mg²⁺ + 2e⁻.',
      'Step 3: 2 Cl atoms accept 1 electron each: 2Cl + 2e⁻ → 2Cl⁻.',
      'Step 4: Draw [Mg]²⁺ inside square brackets with 2.8 shells and +2 outside.',
      'Step 5: Draw [Cl]⁻ with 2.8.8 shells (7 crosses + 1 dot) and -1 outside, with coefficient 2 or two separate ions.'
    ],
    keyMnemonic: '💡 Ionic Bracket Rule: NEVER draw overlapping shells for ionic compounds! Use square brackets [ ] with charges outside.',
    commonMistakes: 'Drawing overlapping shells like covalent bonds, or forgetting square brackets and +2/-1 charges.',
    formulaOrEquation: 'Mg + Cl₂ → [Mg]²⁺ + 2[Cl]⁻ → MgCl₂',
    marks: 3,
    difficulty: 'KBAT (HOTS)',
    relatedModel3DId: 'nacl_lattice',
  },
  // 11. SPM Paper 2 HOT DRAWING: Coordinate / Dative Bond in NH4+ (KSSM Syllabus Target)
  {
    id: 'q_draw_nh4',
    chapterId: 'f4_c5',
    paperType: 'Paper 2 (Structured)',
    questionType: 'drawing_bond',
    isHot2026: true,
    hotRating: 95,
    hotTagText: '🔥 2026 NEW SYLLABUS: Coordinate / Dative Bond (NH₄⁺)',
    questionText: 'Ammonia (NH₃) reacts with Hydrogen ion (H⁺) from an acid to form the Ammonium ion, NH₄⁺. Draw the electron arrangement / Lewis structure diagram showing the formation of the coordinate (dative) bond.',
    questionTextBM: 'Ammonia (NH₃) bertindak balas dengan ion Hidrogen (H⁺) untuk membentuk ion Ammonium, NH₄⁺. Lukis rajah susunan elektron / struktur Lewis yang menunjukkan pembentukan ikatan datif.',
    correctAnswer: 'NH4_DATIVE_DRAWING',
    drawingBondType: 'coordinate_dative',
    drawingTargetFormula: 'NH₄⁺ (Ammonium ion)',
    drawingExpectedElements: [
      'Central Nitrogen atom sharing 3 covalent pairs with 3 Hydrogen atoms',
      'One coordinate (dative) bond where Nitrogen donates both electrons of its lone pair to empty 1s orbital of H⁺',
      'Square brackets surrounding the whole complex with +1 charge: [NH₄]⁺',
      'Dative bond arrow (N → H) or pair of identical dots in overlap'
    ],
    drawingHint: 'Nitrogen has 1 lone pair in NH₃. When H⁺ (which has 0 electrons) approaches, Nitrogen shares its lone pair so H⁺ achieves duplet. Enclose the whole ion in square brackets with a + sign!',
    drawingPresetStamps: ['N', 'H', 'H⁺', '[ ]⁺', 'Dative Arrow →', '•', '✕'],
    explanation: 'A coordinate (dative) bond is a type of covalent bond where the shared pair of electrons comes from ONLY ONE of the atoms. Nitrogen in NH₃ has a lone pair of electrons (••). The Hydrogen ion, H⁺, has an empty orbital. Nitrogen donates its lone pair to be shared with H⁺, forming [NH₄]⁺.',
    stepByStepSolution: [
      'Step 1: Nitrogen in NH₃ has 3 bonding pairs and 1 lone pair of electrons (2.8 octet).',
      'Step 2: H⁺ ion has lost its only electron (empty shell, 0 electrons).',
      'Step 3: Nitrogen donates BOTH electrons from its lone pair to be shared with H⁺.',
      'Step 4: Draw 3 standard C-H single bonds + 1 dative bond (N → H) inside square brackets with [+] charge.'
    ],
    keyMnemonic: '💡 Dative Bond Rule: "One atom donates BOTH electrons of the shared pair to an empty orbital of another species".',
    commonMistakes: 'Assuming H+ also shares an electron (H+ has zero electrons!).',
    formulaOrEquation: 'NH₃ + H⁺ → [NH₄]⁺ (Coordinate / Dative Bond)',
    marks: 3,
    difficulty: 'KBAT (HOTS)',
    relatedModel3DId: 'ammonia',
  }
];

export const DRAWING_CHALLENGES: DrawingChallenge[] = [
  {
    id: 'draw_atom_mg_cl',
    title: 'Atomic Structure: Magnesium Atom & Chloride Ion',
    chapterId: 'f4_c2',
    category: 'atomic_structure',
    isHotSPM: true,
    prompt: 'Draw the electron arrangement diagram of a Magnesium atom (Atomic number = 12) showing the nucleus and all electron shells with paired dots or crosses.',
    promptBM: 'Lukis rajah susunan elektron bagi satu atom Magnesium (Nombor proton = 12) yang menunjukkan nukleus dan semua petala elektron.',
    standardSolutionDescription: 'Nucleus labelled with Mg / 12p, 1st shell with 2 electrons, 2nd shell with 8 electrons (paired), 3rd shell with 2 valence electrons (Electron arrangement: 2.8.2).',
    expectedElements: ['Nucleus with Mg / 12p', 'First shell: 2 electrons', 'Second shell: 8 electrons (paired)', 'Outer shell: 2 valence electrons', 'Electron configuration: 2.8.2'],
    hint: 'Magnesium has proton number 12. Its electron arrangement is 2.8.2. Use our cute electron dot stamp on the 3 circular shells!',
    defaultApparatusStamps: ['nucleus_mg', 'electron_dot', 'electron_cross', 'shell_ring', 'label_text'],
    guideSteps: [
      '1. Stamp or draw the central nucleus and label it "12p" or "Mg".',
      '2. Draw or place 3 concentric electron shell circles.',
      '3. Place 2 electrons in the innermost shell, 8 electrons in the 2nd shell, and 2 valence electrons in the outer shell.',
      '4. Add text label "Susunan elektron: 2.8.2".'
    ]
  },
  {
    id: 'draw_covalent_h2o',
    title: 'Covalent Bonding: Water Molecule (H₂O)',
    chapterId: 'f4_c5',
    category: 'molecular_bonding',
    isHotSPM: true,
    prompt: 'Draw the electron sharing diagram for a Water molecule, H₂O. Show the overlapping shells between Oxygen (2.6) and two Hydrogen (1) atoms with shared electron pairs and lone pairs.',
    promptBM: 'Lukis rajah perkongsian elektron untuk molekul air, H₂O. Tunjukkan pertindihan petala antara atom Oksigen dan dua atom Hidrogen.',
    standardSolutionDescription: 'Central Oxygen atom with 8 total valence electrons (2 shared pairs forming single covalent bonds with 2 Hydrogen atoms + 2 lone pairs of electrons).',
    expectedElements: ['Central Oxygen atom', 'Two overlapping Hydrogen atoms', 'Single shared pair (1 dot + 1 cross) in each overlapping region', 'Two lone pairs on Oxygen atom (4 unshared electrons)'],
    hint: 'Oxygen needs 2 electrons to achieve stable octet; each Hydrogen needs 1 electron for duplet. Oxygen shares 1 electron pair with each H atom!',
    defaultApparatusStamps: ['nucleus_o', 'nucleus_h', 'electron_dot', 'electron_cross', 'covalent_ring'],
    guideSteps: [
      '1. Draw Oxygen outer shell and overlap with two Hydrogen shells at ~104.5° angle.',
      '2. In each overlapping zone, put 1 dot and 1 cross (shared pair).',
      '3. On Oxygen atom, draw the remaining 4 valence electrons as 2 lone pairs.',
      '4. Label H-O-H single covalent bonds.'
    ]
  },
  {
    id: 'draw_voltaic_cell',
    title: 'Apparatus Setup: Simple Chemical Cell (Voltaic Cell)',
    chapterId: 'f5_c1',
    category: 'experiment_apparatus',
    isHotSPM: true,
    prompt: 'Draw the complete and functional laboratory apparatus set-up for a Simple Chemical Cell using Zinc and Copper plates dipped in Copper(II) sulfate solution, connected to a voltmeter.',
    promptBM: 'Lukis susunan radas makmal yang lengkap bagi Sel Kimia Ringkas menggunakan kepingan Zink dan Kuprum yang dicelup ke dalam larutan kuprum(II) sulfat.',
    standardSolutionDescription: 'Beaker containing CuSO₄ solution, Zinc plate (negative terminal) and Copper plate (positive terminal) immersed in solution, connecting wires attached to a Voltmeter with electron flow arrow from Zn to Cu.',
    expectedElements: ['Beaker with electrolyte liquid level', 'Zinc plate electrode (Anode / -)', 'Copper plate electrode (Cathode / +)', 'Voltmeter connected via wires', 'Correct electrolyte label (e.g. 1.0 mol dm⁻³ CuSO₄)', 'Electron flow direction arrow (Zn → Cu)'],
    hint: 'Use the Beaker stamp, add two electrode plates, connect with wire & Voltmeter stamp, and label Zn (-) and Cu (+)!',
    defaultApparatusStamps: ['beaker', 'electrode_zn', 'electrode_cu', 'voltmeter', 'wire_line', 'liquid_fill', 'arrow_flow'],
    guideSteps: [
      '1. Stamp a Beaker and fill with liquid electrolyte (label: CuSO₄ solution).',
      '2. Place Zinc electrode on the left and Copper electrode on the right, both dipping into solution.',
      '3. Draw wires from electrodes to a central Voltmeter.',
      '4. Label (-) terminal on Zinc, (+) terminal on Copper, and draw arrow for electron flow.'
    ]
  },
  {
    id: 'draw_titration_setup',
    title: 'Apparatus Setup: Acid-Base Titration (Burette & Flask)',
    chapterId: 'f4_c6',
    category: 'experiment_apparatus',
    isHotSPM: true,
    prompt: 'Draw the SPM standard apparatus set-up for acid-base titration: a Burette clamped to a Retort Stand filled with standard acid solution, delivering into a Conical Flask on a white tile.',
    promptBM: 'Lukis susunan radas piawai SPM bagi pentitratan asid-bes: Buret diapit pada kaki retort berisi asid, dititratkan ke dalam Kelalang Kon di atas jubin putih.',
    standardSolutionDescription: 'Vertical Burette with stopcock clamped to Retort Stand, conical flask underneath containing alkali + phenolphthalein indicator, white tile under flask to detect sharp color change.',
    expectedElements: ['Burette with scale markings', 'Retort stand with clamp', 'Conical flask underneath burette tip', 'White tile under conical flask', 'Labels: Burette, Hydrochloric acid, Conical flask, NaOH + Indicator, White tile'],
    hint: 'Remember the white tile at the base — it is essential in SPM practical marks for seeing the end point color change clearly!',
    defaultApparatusStamps: ['retort_stand', 'burette', 'clamp', 'conical_flask', 'white_tile', 'liquid_fill', 'drop_liquid'],
    guideSteps: [
      '1. Stamp the Retort Stand on the left.',
      '2. Stamp the Burette clamped vertically in the stand.',
      '3. Place the Conical Flask directly beneath the burette tip.',
      '4. Add a White Tile beneath the conical flask.',
      '5. Label all parts with neat straight pointer lines!'
    ]
  }
];

export const MODELS_3D: Model3DData[] = [
  {
    id: 'methane',
    name: 'Methane (CH₄)',
    category: 'molecule',
    formula: 'CH₄',
    chapterId: 'f4_c5',
    description: 'Methane has a 3D Tetrahedral geometry. The central Carbon atom forms 4 single covalent bonds with 4 Hydrogen atoms to minimize electron repulsion.',
    geometryType: 'tetrahedral',
    bondAngle: '109.5°',
    hybridization: 'sp³ hybridization',
    funFact: 'Main component of natural gas (LNG). Symmetrical non-polar molecule with low boiling point (-161.5°C).'
  },
  {
    id: 'water',
    name: 'Water (H₂O)',
    category: 'molecule',
    formula: 'H₂O',
    chapterId: 'f4_c5',
    description: 'Water has a Bent / V-shaped geometry. Two bonding pairs and two non-bonding lone pairs on Oxygen push the bond angle down from 109.5° to 104.5°.',
    geometryType: 'bent',
    bondAngle: '104.5°',
    hybridization: 'sp³ with 2 lone pairs',
    funFact: 'Universal solvent! Strong Hydrogen bonding between water molecules gives it an unusually high boiling point (100°C).'
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide (CO₂)',
    category: 'molecule',
    formula: 'CO₂',
    chapterId: 'f4_c5',
    description: 'Carbon Dioxide has a Linear geometry with two double covalent bonds (O=C=O). Zero net dipole moment because bond dipoles cancel out.',
    geometryType: 'linear',
    bondAngle: '180.0°',
    hybridization: 'sp hybridization',
    funFact: 'Used in fire extinguishers and carbonated drinks. Sublimes directly from solid (dry ice) to gas at -78.5°C!'
  },
  {
    id: 'ammonia',
    name: 'Ammonia (NH₃)',
    category: 'molecule',
    formula: 'NH₃',
    chapterId: 'f4_c5',
    description: 'Ammonia has a Trigonal Pyramidal geometry. One lone pair on Nitrogen repels the 3 N-H bonding pairs, giving a 107° bond angle.',
    geometryType: 'pyramidal',
    bondAngle: '107.0°',
    hybridization: 'sp³ with 1 lone pair',
    funFact: 'Very soluble in water forming alkaline aqueous ammonia (NH₃ + H₂O ⇌ NH₄⁺ + OH⁻), used in Haber process and fertilizers.'
  },
  {
    id: 'ethanol',
    name: 'Ethanol (C₂H₅OH)',
    category: 'molecule',
    formula: 'C₂H₅OH',
    chapterId: 'f5_c2',
    description: 'Organic alcohol molecule with a 2-carbon chain and a polar Hydroxyl (-OH) functional group capable of hydrogen bonding.',
    geometryType: 'ethanol',
    bondAngle: '109.5° (C-C-O) & 104.5° (C-O-H)',
    funFact: 'Can undergo oxidation with acidified K₂Cr₂O₇ to form Ethanoic acid (vinegar) or dehydration with porcelain chips to form Ethene!'
  },
  {
    id: 'nacl_lattice',
    name: 'Sodium Chloride Lattice (NaCl)',
    category: 'crystal',
    formula: 'NaCl',
    chapterId: 'f4_c5',
    description: 'Giant ionic crystal lattice with face-centered cubic arrangement. Each Na⁺ cation is surrounded by 6 Cl⁻ anions and vice versa.',
    geometryType: 'crystal_lattice',
    funFact: 'Conducts electricity ONLY in molten or aqueous state because ions are free to move. In solid state, ions are locked in fixed lattice points.'
  },
  {
    id: 'bohr_atom',
    name: 'Bohr Planetary Atom Model',
    category: 'atom',
    formula: '²⁴₁₂Mg / Atom Orbit',
    chapterId: 'f4_c2',
    description: '3D interactive atomic model showing the central dense nucleus containing protons and neutrons, surrounded by electrons orbiting in quantized energy shells.',
    geometryType: 'bohr_atom',
    funFact: 'Introduced by Niels Bohr in 1913. Explains the discrete line emission spectrum of hydrogen gas!'
  },
  {
    id: 'voltaic_cell',
    name: '3D Voltaic Cell (Chemical Cell)',
    category: 'apparatus',
    formula: 'Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)',
    chapterId: 'f5_c1',
    description: 'Interactive 3D chemical cell showing Zinc and Copper half-cells, salt bridge (KCl/KNO₃), voltmeter, and the direction of electron flow.',
    geometryType: 'voltaic_cell',
    funFact: 'Generates electricity spontaneously from chemical energy (E°cell = +1.10 V). Salt bridge maintains electrical neutrality by allowing ion migration.'
  },
  {
    id: 'titration_apparatus',
    name: '3D Titration Apparatus Setup',
    category: 'apparatus',
    formula: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
    chapterId: 'f4_c6',
    description: 'Complete 3D laboratory titration apparatus with calibrated burette, retort stand, conical flask, and indicator color transition simulation.',
    geometryType: 'titration',
    funFact: 'The end point is reached when a single drop of acid turns phenolphthalein indicator from pink to completely colorless!'
  }
];

export const QUALITATIVE_TESTS: QualitativeTestItem[] = [
  {
    ion: 'Fe²⁺ (Iron(II) ion)',
    type: 'cation',
    reagentNaOH: 'Dirty green precipitate formed, insoluble in excess NaOH. Turns brown on standing (oxidised to Fe³⁺).',
    reagentNH3: 'Dirty green precipitate formed, insoluble in excess NH₃.',
    confirmatoryTest: 'Add Potassium hexacyanoferrate(III), K₃[Fe(CN)₆] → Dark blue precipitate (Turnbulls blue).',
    mnemonic: 'Fe²⁺ is Green like grass!',
    colorHex: '#10b981'
  },
  {
    ion: 'Fe³⁺ (Iron(III) ion)',
    type: 'cation',
    reagentNaOH: 'Reddish-brown precipitate formed, insoluble in excess NaOH.',
    reagentNH3: 'Reddish-brown precipitate formed, insoluble in excess NH₃.',
    confirmatoryTest: 'Add Potassium thiocyanate, KSCN → Blood red solution.',
    mnemonic: 'Fe³⁺ is Rust Brown / Blood Red with KSCN!',
    colorHex: '#b45309'
  },
  {
    ion: 'Cu²⁺ (Copper(II) ion)',
    type: 'cation',
    reagentNaOH: 'Blue precipitate formed, insoluble in excess NaOH.',
    reagentNH3: 'Blue precipitate formed, dissolves in excess NH₃ to form Dark Royal Blue solution [Cu(NH₃)₄]²⁺.',
    confirmatoryTest: 'Add Potassium hexacyanoferrate(II), K₄[Fe(CN)₆] → Chocolate brown precipitate.',
    mnemonic: 'Cu²⁺ = Royal Blue crown in excess NH₃!',
    colorHex: '#0284c7'
  },
  {
    ion: 'Pb²⁺ (Lead(II) ion)',
    type: 'cation',
    reagentNaOH: 'White precipitate formed, dissolves in excess NaOH to form colorless solution.',
    reagentNH3: 'White precipitate formed, insoluble in excess NH₃.',
    confirmatoryTest: 'Add Potassium iodide (KI) solution → Bright yellow precipitate of PbI₂ formed (dissolves in hot water).',
    mnemonic: 'Pb²⁺ forms Golden Yellow stars with KI!',
    colorHex: '#eab308'
  },
  {
    ion: 'Zn²⁺ (Zinc ion)',
    type: 'cation',
    reagentNaOH: 'White precipitate formed, dissolves in excess NaOH to form colorless solution.',
    reagentNH3: 'White precipitate formed, dissolves in excess NH₃ to form colorless solution.',
    confirmatoryTest: 'The ONLY cation whose white precipitate dissolves in BOTH excess NaOH and excess NH₃!',
    mnemonic: 'Zn²⁺ is Double-Soluble (Dissolves in both NaOH & NH₃)!',
    colorHex: '#a855f7'
  },
  {
    ion: 'Al³⁺ (Aluminium ion)',
    type: 'cation',
    reagentNaOH: 'White precipitate formed, dissolves in excess NaOH to form colorless solution.',
    reagentNH3: 'White precipitate formed, insoluble in excess NH₃.',
    confirmatoryTest: 'Add KI solution → No precipitate (differentiates Al³⁺ from Pb²⁺).',
    mnemonic: 'Al³⁺ dissolves in NaOH but no yellow with KI!',
    colorHex: '#64748b'
  },
  {
    ion: 'NH₄⁺ (Ammonium ion)',
    type: 'cation',
    reagentNaOH: 'No precipitate. On heating, pungent gas released turns moist red litmus paper BLUE (NH₃ gas evolved).',
    reagentNH3: 'No reaction.',
    confirmatoryTest: 'Add Nessler reagent → Brown precipitate formed.',
    mnemonic: 'NH₄⁺ gas is basic and turns red litmus blue on heating!',
    colorHex: '#f97316'
  },
  {
    ion: 'NO₃⁻ (Nitrate ion)',
    type: 'anion',
    reagentNaOH: 'Add dilute H₂SO₄, then FeSO₄ solution, then carefully trickle conc. H₂SO₄ down the side of test tube.',
    reagentNH3: 'N/A',
    confirmatoryTest: 'Brown Ring Test: A distinct brown ring [Fe(H₂O)₅(NO)]²⁺ forms at the junction of the two liquid layers.',
    mnemonic: 'Nitrate = The Famous Brown Ring Test 💍',
    colorHex: '#854d0e'
  },
  {
    ion: 'Cl⁻ (Chloride ion)',
    type: 'anion',
    reagentNaOH: 'Add dilute Nitric acid (HNO₃), then add Silver nitrate (AgNO₃) solution.',
    reagentNH3: 'N/A',
    confirmatoryTest: 'White precipitate of Silver chloride (AgCl) formed, which dissolves in aqueous ammonia.',
    mnemonic: 'Ag⁺ + Cl⁻ = White AgCl snow!',
    colorHex: '#94a3b8'
  },
  {
    ion: 'SO₄²⁻ (Sulfate ion)',
    type: 'anion',
    reagentNaOH: 'Add dilute Hydrochloric acid (HCl), then add Barium chloride (BaCl₂) solution.',
    reagentNH3: 'N/A',
    confirmatoryTest: 'White precipitate of Barium sulfate (BaSO₄) formed, insoluble in dilute acid.',
    mnemonic: 'Ba²⁺ + SO₄²⁻ = Insoluble white BaSO₄ rock!',
    colorHex: '#64748b'
  },
  {
    ion: 'CO₃²⁻ (Carbonate ion)',
    type: 'anion',
    reagentNaOH: 'Add dilute acid (HCl or HNO₃).',
    reagentNH3: 'N/A',
    confirmatoryTest: 'Effervescence / gas bubbles produced that turn limewater (Ca(OH)₂) chalky/milky (CO₂ gas).',
    mnemonic: 'Carbonate = Fizzing bubbles that turn limewater milky!',
    colorHex: '#06b6d4'
  }
];

export const CUTE_AVATARS = [
  { id: 'atomie', name: 'Atomie', icon: '⚛️', color: 'bg-amber-100 border-amber-300 text-amber-600', role: 'student', title: 'Curious Electron Hunter' },
  { id: 'beaker', name: 'Bubbly Beaker', icon: '🧪', color: 'bg-emerald-100 border-emerald-300 text-emerald-600', role: 'student', title: 'Precipitate Wizard' },
  { id: 'flasky', name: 'Flasky Pipette', icon: '🫧', color: 'bg-sky-100 border-sky-300 text-sky-600', role: 'student', title: 'Titration Champion' },
  { id: 'ellie', name: 'Electron Ellie', icon: '⚡', color: 'bg-purple-100 border-purple-300 text-purple-600', role: 'student', title: 'Redox Specialist' },
  { id: 'pip', name: 'Proton Pip', icon: '🌟', color: 'bg-pink-100 border-pink-300 text-pink-600', role: 'student', title: 'Mole Master' },
  { id: 'teacher_aisyah', name: 'Cikgu Aisyah', icon: '👩‍🏫', color: 'bg-rose-100 border-rose-300 text-rose-600', role: 'teacher', title: 'Head of Chemistry Dept' },
  { id: 'teacher_tan', name: 'Mr. Tan', icon: '👨‍🏫', color: 'bg-indigo-100 border-indigo-300 text-indigo-600', role: 'teacher', title: 'SPM Master Examiner' },
  { id: 'dr_molecule', name: 'Dr. Molecule', icon: '🧙‍♂️', color: 'bg-teal-100 border-teal-300 text-teal-600', role: 'teacher', title: 'AI Chemistry Guru' },
];

export const MOCK_STUDENTS = [
  {
    id: 's_adam',
    name: 'Adam Zikri',
    avatar: 'atomie',
    form: 'Form 5' as const,
    className: '5 Sains 1',
    xp: 1450,
    streakDays: 6,
    masteryPercentage: 78,
    lastActive: '10 mins ago',
    weakChapter: 'f5_c1' as const, // Redox
    totalMistakes: 3,
    solvedQuizzes: 24,
    drawingScore: 88,
  },
  {
    id: 's_siti',
    name: 'Siti Nurhaliza',
    avatar: 'beaker',
    form: 'Form 5' as const,
    className: '5 Sains 1',
    xp: 2200,
    streakDays: 14,
    masteryPercentage: 92,
    lastActive: 'Just now',
    weakChapter: 'f4_c6' as const, // Salts
    totalMistakes: 1,
    solvedQuizzes: 35,
    drawingScore: 95,
  },
  {
    id: 's_weikang',
    name: 'Tan Wei Kang',
    avatar: 'ellie',
    form: 'Form 5' as const,
    className: '5 Sains 2',
    xp: 980,
    streakDays: 3,
    masteryPercentage: 62,
    lastActive: '2 hours ago',
    weakChapter: 'f5_c1' as const, // Redox
    totalMistakes: 7,
    solvedQuizzes: 15,
    drawingScore: 74,
  },
  {
    id: 's_priya',
    name: 'Priya Dharshini',
    avatar: 'flasky',
    form: 'Form 4' as const,
    className: '4 Dedikasi',
    xp: 1800,
    streakDays: 9,
    masteryPercentage: 84,
    lastActive: '1 day ago',
    weakChapter: 'f4_c3' as const, // Mole concept
    totalMistakes: 4,
    solvedQuizzes: 28,
    drawingScore: 90,
  },
];

export const MOCK_ROOMS: ClassroomRoom[] = [
  {
    id: 'room_chem_501',
    code: 'CHEM-501',
    name: '5 Sains 1 (Chemistry SPM 2026)',
    school: 'SMK Seri Bintang',
    teacherId: 'teacher_aisyah',
    teacherName: 'Cikgu Aisyah (Head of Chemistry)',
    subject: 'SPM Chemistry Form 5',
    form: 'Form 5',
    studentIds: ['s_adam', 's_siti', 's_weikang'],
    createdAt: '2026-01-10T08:00:00.000Z',
    description: 'Official SPM 2026 Chemistry target class. Weekly Paper 2 drawing homework and hot question drills.',
    announcement: '📢 Please submit the CCl₄ Covalent Bond & Lewis Structure drawing exercise by Friday!',
    bannerColor: 'from-indigo-600 to-blue-700',
  },
  {
    id: 'room_chem_402',
    code: 'CHEM-402',
    name: '4 Dedikasi (Foundation Chemistry)',
    school: 'SMK Seri Bintang',
    teacherId: 'teacher_aisyah',
    teacherName: 'Cikgu Aisyah (Head of Chemistry)',
    subject: 'SPM Chemistry Form 4',
    form: 'Form 4',
    studentIds: ['s_priya'],
    createdAt: '2026-02-01T08:00:00.000Z',
    description: 'Form 4 Chemistry fundamentals: Mole calculations, Periodic Table trends, and Chemical Bonds.',
    announcement: '💡 Practice writing empirical formula equations for Magnesium oxide!',
    bannerColor: 'from-teal-600 to-emerald-700',
  },
  {
    id: 'room_damansara_501',
    code: 'STAR-2026',
    name: '5 Pure Science (A+ SPM Target)',
    school: 'SMK Damansara Utama',
    teacherId: 'teacher_tan',
    teacherName: 'Mr. Tan (SPM Master Examiner)',
    subject: 'SPM Chemistry Form 5',
    form: 'Form 5',
    studentIds: ['s_daniel', 's_chloe'],
    createdAt: '2026-01-15T09:00:00.000Z',
    description: 'Private classroom for SMK Damansara Utama pure science cohort. Highly focused on Paper 2 Section C KBAT.',
    announcement: '🎯 Thermochemistry heat of neutralisation calculation test next Monday.',
    bannerColor: 'from-purple-600 to-indigo-800',
  },
];

export const MOCK_EXERCISES: RoomExercise[] = [
  {
    id: 'ex_ccl4_drawing',
    roomId: 'room_chem_501',
    teacherId: 'teacher_aisyah',
    title: 'SPM Target: Covalent Bond Formation Drawing (CCl₄)',
    chapterId: 'f4_c5',
    description: 'Draw the complete electron arrangement for Tetrachloromethane, CCl₄. Make sure all 6 unshared valence electrons on EACH Chlorine atom are clearly drawn to receive full 3 marks!',
    dueDate: '2026-09-02T23:59:59.000Z',
    type: 'bond_drawing',
    targetBondFormula: 'CCl₄ (Tetrachloromethane)',
    totalPoints: 100,
    createdAt: '2026-08-20T10:00:00.000Z',
    instructions: [
      '1. Draw central Carbon atom with 4 outer overlapping Chlorine shells.',
      '2. Place 1 shared electron pair (• ✕) in each overlap region.',
      '3. Draw 6 non-bonding valence electrons (3 lone pairs) on each Chlorine atom.',
      '4. Label CCl₄ and write brief explanation for stable octet fulfillment.'
    ],
    attachedQuestionIds: ['q_draw_ccl4']
  },
  {
    id: 'ex_redox_drill',
    roomId: 'room_chem_501',
    teacherId: 'teacher_aisyah',
    title: 'Redox Equilibrium: E° Values & Voltaic Cell Half-Equations',
    chapterId: 'f5_c1',
    description: 'Complete the structured hot question drill on Standard Electrode Potentials (E°), identifying Anode/Cathode and writing balanced ionic half-equations.',
    dueDate: '2026-09-05T23:59:59.000Z',
    type: 'quiz_drill',
    totalPoints: 100,
    createdAt: '2026-08-22T14:30:00.000Z',
    instructions: [
      '1. Review E° values: More negative E° = Anode (Oxidation).',
      '2. Formulate net ionic equations.',
      '3. Calculate E°cell = E°(cathode) - E°(anode).'
    ],
    attachedQuestionIds: ['q_redox_01']
  },
  {
    id: 'ex_salt_precip',
    roomId: 'room_chem_402',
    teacherId: 'teacher_aisyah',
    title: 'Preparation of Insoluble Salt (PbSO₄) Homework',
    chapterId: 'f4_c6',
    description: 'Explain why Lead(II) sulfate cannot be prepared using Lead metal with dilute sulfuric acid, and describe the double decomposition precipitation procedure.',
    dueDate: '2026-09-01T23:59:59.000Z',
    type: 'past_year_structured',
    totalPoints: 50,
    createdAt: '2026-08-24T09:00:00.000Z',
    instructions: [
      '1. Identify soluble reactants needed (e.g. Lead(II) nitrate + Sodium sulfate).',
      '2. Write full balanced chemical and ionic equation.',
      '3. Describe filtration, washing with distilled water, and drying between filter papers.'
    ]
  }
];

export const MOCK_HOMEWORK_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'sub_adam_01',
    exerciseId: 'ex_ccl4_drawing',
    roomId: 'room_chem_501',
    studentId: 's_adam',
    studentName: 'Adam Zikri',
    studentAvatar: 'atomie',
    school: 'SMK Seri Bintang',
    studentForm: 'Form 5',
    submittedAt: '2026-08-22T16:20:00.000Z',
    status: 'graded',
    score: 95,
    maxScore: 100,
    drawingDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="white"/><circle cx="200" cy="150" r="28" fill="%23e0e7ff" stroke="%234f46e5" stroke-width="2"/><text x="200" y="156" font-family="sans-serif" font-size="14" fill="%23312e81" font-weight="bold" text-anchor="middle">C</text><circle cx="200" cy="65" r="28" fill="%23ecfdf5" stroke="%23059669" stroke-width="2"/><text x="200" y="71" font-family="sans-serif" font-size="14" fill="%23064e3b" font-weight="bold" text-anchor="middle">Cl</text><circle cx="200" cy="235" r="28" fill="%23ecfdf5" stroke="%23059669" stroke-width="2"/><text x="200" y="241" font-family="sans-serif" font-size="14" fill="%23064e3b" font-weight="bold" text-anchor="middle">Cl</text><circle cx="115" cy="150" r="28" fill="%23ecfdf5" stroke="%23059669" stroke-width="2"/><text x="115" y="156" font-family="sans-serif" font-size="14" fill="%23064e3b" font-weight="bold" text-anchor="middle">Cl</text><circle cx="285" cy="150" r="28" fill="%23ecfdf5" stroke="%23059669" stroke-width="2"/><text x="285" y="156" font-family="sans-serif" font-size="14" fill="%23064e3b" font-weight="bold" text-anchor="middle">Cl</text><text x="200" y="108" font-size="12" fill="%23dc2626" font-weight="bold" text-anchor="middle">• ✕</text><text x="200" y="200" font-size="12" fill="%23dc2626" font-weight="bold" text-anchor="middle">• ✕</text><text x="156" y="154" font-size="12" fill="%23dc2626" font-weight="bold" text-anchor="middle">• ✕</text><text x="244" y="154" font-size="12" fill="%23dc2626" font-weight="bold" text-anchor="middle">• ✕</text></svg>',
    studentNotes: 'I drew the 4 shared pairs and made sure all 4 Chlorine atoms have full 8 valence electrons according to the SPM marking scheme.',
    teacherFeedback: 'Outstanding work Adam! Clean shell overlaps and correct 4 single covalent bonds. Full marks on Paper 2 Section A standard!',
    teacherSticker: '⭐ Perfect Electron Shells!',
    gradedAt: '2026-08-23T09:15:00.000Z'
  },
  {
    id: 'sub_siti_01',
    exerciseId: 'ex_ccl4_drawing',
    roomId: 'room_chem_501',
    studentId: 's_siti',
    studentName: 'Siti Nurhaliza',
    studentAvatar: 'beaker',
    school: 'SMK Seri Bintang',
    studentForm: 'Form 5',
    submittedAt: '2026-08-21T18:00:00.000Z',
    status: 'graded',
    score: 98,
    maxScore: 100,
    drawingDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="white"/><circle cx="200" cy="150" r="30" fill="%23fdf2f8" stroke="%23db2777" stroke-width="2"/><text x="200" y="156" font-family="sans-serif" font-size="14" fill="%23831843" font-weight="bold" text-anchor="middle">C</text><text x="200" y="280" font-family="sans-serif" font-size="12" fill="%23475569" text-anchor="middle">CCl₄ Electron Sharing Diagram (Octet)</text></svg>',
    studentNotes: 'Included step by step electron sharing notes: C shares 1 valence electron with each Cl atom.',
    teacherFeedback: 'Flawless diagram Siti! Exemplary presentation and very neat labeling.',
    teacherSticker: '🌟 Chemist of the Week!',
    gradedAt: '2026-08-22T10:00:00.000Z'
  },
  {
    id: 'sub_weikang_01',
    exerciseId: 'ex_ccl4_drawing',
    roomId: 'room_chem_501',
    studentId: 's_weikang',
    studentName: 'Tan Wei Kang',
    studentAvatar: 'ellie',
    school: 'SMK Seri Bintang',
    studentForm: 'Form 5',
    submittedAt: '2026-08-25T20:10:00.000Z',
    status: 'submitted',
    maxScore: 100,
    drawingDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="white"/><circle cx="200" cy="150" r="28" fill="%23eff6ff" stroke="%232563eb" stroke-width="2"/><text x="200" y="156" font-family="sans-serif" font-size="14" fill="%231e3a8a" font-weight="bold" text-anchor="middle">C</text></svg>',
    studentNotes: 'Teacher, I struggled slightly with drawing the 6 lone electrons on each chlorine, but I put the 4 shared pairs.',
  }
];

export const MACRO_WEAK_TOPICS: MacroWeakTopic[] = [
  {
    id: 'macro_redox_e0',
    chapterId: 'f5_c1',
    chapterTitle: 'Redox Equilibrium (Form 5 Chapter 1)',
    topicName: 'Standard Electrode Potential ($E^0$) & Half-Equation Writing',
    nationalAverageAccuracy: 41,
    topMistakeReason: 'Students frequently reverse the Anode and Cathode when given negative $E^0$ values. They forget that more negative $E^0$ means stronger reducing agent (releases electrons = Anode/Oxidation).',
    spmExamWeight: 'Paper 2 Section B / C (10 - 20 Marks)',
    hotPrediction2026: true,
    sampleQuestionTitle: 'Voltaic Cell & Rusting Sacrificial Protection',
    commonTraps: [
      'Confusing electron flow direction (electrons flow from negative Anode to positive Cathode).',
      'Forgetting state symbols (s, aq, l, g) in overall redox ionic equations.',
      'Writing Cu²⁺ + e⁻ → Cu instead of balancing with 2e⁻.'
    ],
    keyFixStrategy: 'Mnemonic "An Ox Red Cat" (Anode = Oxidation, Reduction = Cathode) and E°cell = E°(cathode) - E°(anode).'
  },
  {
    id: 'macro_salts_qual',
    chapterId: 'f4_c6',
    chapterTitle: 'Acids, Bases & Salts (Form 4 Chapter 6)',
    topicName: 'Qualitative Analysis of Cations ($NaOH$ vs $NH_3$) & Salt Preparation',
    nationalAverageAccuracy: 46,
    topMistakeReason: 'Students mix up cations that dissolve in excess $NaOH$ vs excess $NH_3$. For salt preparation, many mistakenly react insoluble lead oxide with sulfuric acid instead of precipitation.',
    spmExamWeight: 'Paper 2 Structured + Paper 3 Practical (15 - 25 Marks)',
    hotPrediction2026: true,
    sampleQuestionTitle: 'Identification of Unknown Salt X with NaOH & NH₃',
    commonTraps: [
      'Thinking PbSO₄ can be prepared by reacting Pb metal with H₂SO₄ (insoluble layer coats and stops reaction!).',
      'Forgetting that ONLY Zinc ($Zn^{2+}$) dissolves in BOTH excess $NaOH$ and excess $NH_3$.',
      'Confusing Al³⁺ and Pb²⁺ without performing the KI confirmatory test (yellow ppt for Pb²⁺).'
    ],
    keyFixStrategy: 'Mnemonic "ZAP" (Zn²⁺, Al³⁺, Pb²⁺) for NaOH solubility, and "PBC" for insoluble sulfates.'
  },
  {
    id: 'macro_bond_drawing',
    chapterId: 'f4_c5',
    chapterTitle: 'Chemical Bonds (Form 4 Chapter 5)',
    topicName: 'Lewis Structure & Electron Arrangement Diagrams (Covalent & Coordinate)',
    nationalAverageAccuracy: 52,
    topMistakeReason: 'When drawing covalent molecules like $CCl_4$ or $H_2O$, students draw the shared pairs but forget to draw the remaining outer valence electrons on the peripheral atoms, losing the octet mark.',
    spmExamWeight: 'Paper 2 Section A (4 - 8 Marks)',
    hotPrediction2026: true,
    sampleQuestionTitle: 'Electron Arrangement of CCl₄ and Coordinate Bond in NH₄⁺',
    commonTraps: [
      'Drawing overlapping rings for Ionic bonds (Ionic bonds MUST use square brackets [ ] with charges, never overlaps!).',
      'Forgetting 6 non-bonding valence electrons on each Chlorine atom in CCl₄.',
      'Forgetting square brackets and + charge for Ammonium ion [NH₄]⁺.'
    ],
    keyFixStrategy: 'Check octet for every atom (8 electrons each) and remember brackets for ions.'
  },
  {
    id: 'macro_thermo_calc',
    chapterId: 'f5_c3',
    chapterTitle: 'Thermochemistry (Form 5 Chapter 3)',
    topicName: 'Heat of Neutralisation ($ΔH$) Comparison & Calorimeter Calculations ($q = mcΔθ$)',
    nationalAverageAccuracy: 55,
    topMistakeReason: 'Students forget that weak acids (e.g. $CH_3COOH$) produce less heat (e.g. -55 kJ/mol instead of -57.3 kJ/mol) because part of the heat released is absorbed to fully ionise the weak acid.',
    spmExamWeight: 'Paper 2 Structured (8 - 12 Marks)',
    hotPrediction2026: true,
    sampleQuestionTitle: 'Heat of Neutralisation Comparison (HCl vs CH₃COOH with NaOH)',
    commonTraps: [
      'Forgetting the negative (-) sign in exothermic $ΔH$ values.',
      'Using wrong mass $m$ in $mcΔθ$ (mass is total volume of solution, not mass of salt).',
      'Confusing weak acid with dilute acid.'
    ],
    keyFixStrategy: 'Always state: "Weak acid ionises partially, some heat absorbed to completely dissociate unionised molecules".'
  },
  {
    id: 'macro_mole_stoich',
    chapterId: 'f4_c3',
    chapterTitle: 'Mole Concept & Formulae (Form 4 Chapter 3)',
    topicName: 'Stoichiometric Calculations & Limiting Reactants at Room Condition vs STP',
    nationalAverageAccuracy: 59,
    topMistakeReason: 'Confusing molar volume at STP ($22.4\\text{ dm}^3\\text{ mol}^{-1}$) with Room Temperature and Pressure ($24.0\\text{ dm}^3\\text{ mol}^{-1}$).',
    spmExamWeight: 'Paper 1 & Paper 2 (8 - 15 Marks)',
    hotPrediction2026: true,
    sampleQuestionTitle: 'Empirical Formula Determination of Copper(II) Oxide vs Magnesium Oxide',
    commonTraps: [
      'Using Hydrogen combustion tube method for MgO (Magnesium is higher than Hydrogen in reactivity series!).',
      'Dividing by atomic mass upside down when calculating empirical formula ratio.'
    ],
    keyFixStrategy: 'Crucible method for reactive metals (Mg), Hydrogen tube method for less reactive metals (Cu, Pb).'
  }
];

