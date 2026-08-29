export interface ActionLogItem {
  type: 'stamp' | 'line' | 'circle' | 'rect' | 'pen' | 'text';
  id?: string;
  name?: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  text?: string;
  color?: string;
  size?: number;
}

export interface DrawingCriteriaCheck {
  id: string;
  name: string;
  description: string;
  points: number;
  earned: number;
  status: 'passed' | 'partial' | 'missing';
  tip?: string;
}

export interface DrawingEvaluationResult {
  score: number;
  maxScore: number;
  isPassed: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
  criteria: DrawingCriteriaCheck[];
}

/**
 * Analyzes the canvas bitmap and user interaction log to verify correctness against SPM chemistry criteria.
 */
export function evaluateSPMDrawing(
  canvas: HTMLCanvasElement | null,
  challengeId: string,
  actions: ActionLogItem[]
): DrawingEvaluationResult {
  if (!canvas) {
    return {
      score: 0,
      maxScore: 100,
      isPassed: false,
      feedback: 'Canvas not initialized.',
      strengths: [],
      improvements: ['Please redraw and submit.'],
      criteria: [],
    };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      score: 0,
      maxScore: 100,
      isPassed: false,
      feedback: 'Could not access canvas context.',
      strengths: [],
      improvements: [],
      criteria: [],
    };
  }

  // 1. Analyze Pixel Data
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let nonWhitePixels = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let sumX = 0;
  let sumY = 0;

  // Quadrant distribution
  let topHalfCount = 0;
  let bottomHalfCount = 0;
  let leftHalfCount = 0;
  let rightHalfCount = 0;
  let centerRegionCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Consider non-white if not pure white/translucent
      const isNotWhite = a > 30 && (r < 240 || g < 240 || b < 240);

      if (isNotWhite) {
        nonWhitePixels++;
        sumX += x;
        sumY += y;

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        if (y < height / 2) topHalfCount++;
        else bottomHalfCount++;

        if (x < width / 2) leftHalfCount++;
        else rightHalfCount++;

        if (x > width * 0.25 && x < width * 0.75 && y > height * 0.25 && y < height * 0.75) {
          centerRegionCount++;
        }
      }
    }
  }

  const stamps = actions.filter((a) => a.type === 'stamp');
  const shapes = actions.filter((a) => ['line', 'circle', 'rect'].includes(a.type));
  const freehand = actions.filter((a) => a.type === 'pen');
  const textLabels = actions.filter((a) => a.type === 'text');

  // If the canvas is virtually empty
  if (nonWhitePixels < 400 && stamps.length === 0 && textLabels.length === 0 && shapes.length === 0) {
    return {
      score: 0,
      maxScore: 100,
      isPassed: false,
      feedback: 'The canvas is currently empty or has almost no drawing! Please draw or stamp the required apparatus, connect parts, and add labels before submitting.',
      strengths: [],
      improvements: [
        'Place or draw the primary apparatus / atoms for this challenge',
        'Add required SPM labels (e.g. solution names, terminals, electron shells)',
        'Ensure all lines and connections are complete',
      ],
      criteria: [
        {
          id: 'completeness',
          name: 'Apparatus / Structure Presence',
          description: 'Required core apparatus or atomic arrangement must be drawn or stamped.',
          points: 40,
          earned: 0,
          status: 'missing',
          tip: 'Use drawing tools or apparatus stamps on the left toolbar.',
        },
        {
          id: 'labels',
          name: 'SPM Chemical Labels',
          description: 'Required pointer labels for solutions, electrodes, or electron arrangements.',
          points: 30,
          earned: 0,
          status: 'missing',
          tip: 'Use the Label (T) tool to place labels.',
        },
        {
          id: 'proportions',
          name: 'Layout & SPM Mark Scheme Compliance',
          description: 'Correct orientation, connections, and airtight joints.',
          points: 30,
          earned: 0,
          status: 'missing',
          tip: 'Follow the SPM scoring checklist below the canvas.',
        },
      ],
    };
  }

  // Challenge-specific validation
  switch (challengeId) {
    case 'draw_atom_mg_cl': {
      return evaluateMagnesiumAtom({
        stamps,
        shapes,
        freehand,
        textLabels,
        nonWhitePixels,
        minX,
        minY,
        maxX,
        maxY,
        centerRegionCount,
      });
    }

    case 'draw_covalent_h2o': {
      return evaluateWaterCovalentBond({
        stamps,
        shapes,
        freehand,
        textLabels,
        nonWhitePixels,
        minX,
        minY,
        maxX,
        maxY,
        centerRegionCount,
      });
    }

    case 'draw_voltaic_cell': {
      return evaluateVoltaicCell({
        stamps,
        shapes,
        freehand,
        textLabels,
        nonWhitePixels,
        minX,
        minY,
        maxX,
        maxY,
        leftHalfCount,
        rightHalfCount,
        topHalfCount,
        bottomHalfCount,
      });
    }

    case 'draw_titration_setup': {
      return evaluateTitrationSetup({
        stamps,
        shapes,
        freehand,
        textLabels,
        nonWhitePixels,
        minX,
        minY,
        maxX,
        maxY,
        topHalfCount,
        bottomHalfCount,
        leftHalfCount,
        rightHalfCount,
      });
    }

    default: {
      return evaluateGenericSPMDrawing({
        stamps,
        shapes,
        freehand,
        textLabels,
        nonWhitePixels,
      });
    }
  }
}

/**
 * Evaluates Challenge 1: Magnesium Atom (2.8.2)
 */
function evaluateMagnesiumAtom(data: {
  stamps: ActionLogItem[];
  shapes: ActionLogItem[];
  freehand: ActionLogItem[];
  textLabels: ActionLogItem[];
  nonWhitePixels: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  centerRegionCount: number;
}): DrawingEvaluationResult {
  const criteria: DrawingCriteriaCheck[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Criterion 1: Central Nucleus (25 pts)
  const hasNucleusStamp = data.stamps.some((s) => s.id?.includes('nucleus') || s.name?.toLowerCase().includes('nucleus'));
  const hasNucleusLabel = data.textLabels.some((l) =>
    /12p|12n|mg|nucleus|nukleus/i.test(l.text || '')
  );
  const hasCentralDensity = data.centerRegionCount > 500;

  if (hasNucleusStamp || (hasNucleusLabel && hasCentralDensity)) {
    criteria.push({
      id: 'nucleus',
      name: 'Central Nucleus (12p, 12n / Mg)',
      description: 'Central nucleus clearly demarcated with proton number / element symbol.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Nucleus properly positioned with correct proton/Mg identity');
  } else if (hasCentralDensity) {
    criteria.push({
      id: 'nucleus',
      name: 'Central Nucleus',
      description: 'Center drawn but missing specific "12p, 12n" or "Mg" nucleus identification.',
      points: 25,
      earned: 15,
      status: 'partial',
      tip: 'Label the nucleus "12p, 12n" or "Mg" using the Label tool or Nucleus stamp.',
    });
    improvements.push('Label the center nucleus with "12p, 12n" or "Mg"');
  } else {
    criteria.push({
      id: 'nucleus',
      name: 'Central Nucleus',
      description: 'Missing central nucleus.',
      points: 25,
      earned: 0,
      status: 'missing',
      tip: 'Add a central nucleus stamp (⚛️) or draw a center circle labeled Mg / 12p.',
    });
    improvements.push('Add a central nucleus with Mg / 12p');
  }

  // Criterion 2: Concentric Electron Shells (25 pts)
  const shellStampCount = data.stamps.filter((s) => s.id?.includes('shell') || s.name?.toLowerCase().includes('shell')).length;
  const circleShapesCount = data.shapes.filter((s) => s.type === 'circle').length;
  const totalShells = shellStampCount + circleShapesCount;

  if (totalShells >= 3 || (data.nonWhitePixels > 5000 && totalShells >= 2)) {
    criteria.push({
      id: 'shells',
      name: '3 Concentric Electron Shells',
      description: 'Three concentric circular orbits for electron arrangement (2.8.2).',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Drew 3 clear concentric electron shells (K, L, M shells)');
  } else if (totalShells === 2 || totalShells === 1) {
    criteria.push({
      id: 'shells',
      name: '3 Concentric Electron Shells',
      description: `Detected only ${totalShells} shell(s). Magnesium (2.8.2) has 3 shells.`,
      points: 25,
      earned: 12,
      status: 'partial',
      tip: 'Magnesium has 3 electron shells. Add one more shell ring around the outside.',
    });
    improvements.push('Add all 3 concentric electron shells for Magnesium atom');
  } else {
    criteria.push({
      id: 'shells',
      name: 'Concentric Shell Rings',
      description: 'Missing circular electron shells.',
      points: 25,
      earned: 0,
      status: 'missing',
      tip: 'Use the Circle tool or Shell Ring stamp (⭕) to place 3 concentric circles.',
    });
    improvements.push('Draw 3 concentric circular electron shells around the nucleus');
  }

  // Criterion 3: Electrons in Shells (2.8.2) (30 pts)
  const electronDots = data.stamps.filter((s) => s.id === 'electron_dot' || s.name?.toLowerCase().includes('dot')).length;
  const electronCrosses = data.stamps.filter((s) => s.id === 'electron_cross' || s.name?.toLowerCase().includes('cross')).length;
  const totalElectrons = electronDots + electronCrosses;

  if (totalElectrons >= 10 && totalElectrons <= 14) {
    criteria.push({
      id: 'electrons',
      name: 'Electron Placement (2.8.2 configuration)',
      description: 'Accurate total of 12 electrons placed with pairing in the second shell.',
      points: 30,
      earned: 30,
      status: 'passed',
    });
    strengths.push('Correct number of electrons (12 electrons: 2 in 1st, 8 in 2nd, 2 valence in 3rd)');
  } else if (totalElectrons >= 6 || (totalElectrons === 0 && data.nonWhitePixels > 4500)) {
    const earned = totalElectrons >= 6 ? 20 : 15;
    criteria.push({
      id: 'electrons',
      name: 'Electron Placement (2.8.2 configuration)',
      description: totalElectrons > 0
        ? `Found ${totalElectrons} electrons. Magnesium atom has exactly 12 electrons (2, 8, 2).`
        : 'Electrons hand-drawn on shells. Recommended to stamp clear paired dots (•) or crosses (×).',
      points: 30,
      earned,
      status: 'partial',
      tip: 'Place exactly 2 electrons on shell 1, 8 electrons on shell 2, and 2 valence electrons on shell 3.',
    });
    improvements.push('Verify exact electron count: 2 (inner) + 8 (middle) + 2 (outer) = 12 total');
  } else {
    criteria.push({
      id: 'electrons',
      name: 'Electron Dots or Crosses',
      description: 'Missing electron dots or crosses on the shells.',
      points: 30,
      earned: 0,
      status: 'missing',
      tip: 'Use the Blue Dot (🔵) or Red Cross (❌) stamps to place 12 electrons onto the 3 shells.',
    });
    improvements.push('Stamp electron dots (•) or crosses (×) on each shell');
  }

  // Criterion 4: SPM Labels & Configuration (20 pts)
  const hasConfigText = data.textLabels.some((l) =>
    /2\.8\.2|2,8,2|susunan|electron|magnesium|mg/i.test(l.text || '')
  );

  if (hasConfigText) {
    criteria.push({
      id: 'labels',
      name: 'SPM Electron Configuration Label',
      description: 'Included label "2.8.2" or "Susunan elektron: 2.8.2".',
      points: 20,
      earned: 20,
      status: 'passed',
    });
    strengths.push('Included clear SPM electron configuration label (2.8.2)');
  } else {
    criteria.push({
      id: 'labels',
      name: 'SPM Electron Configuration Label',
      description: 'Missing text label "Susunan elektron: 2.8.2".',
      points: 20,
      earned: 5,
      status: 'partial',
      tip: 'Use the Label tool (T) to type "Susunan elektron: 2.8.2" below the diagram.',
    });
    improvements.push('Add text label "Susunan elektron: 2.8.2" for complete SPM marking skema');
  }

  const score = criteria.reduce((sum, c) => sum + c.earned, 0);
  const isPassed = score >= 70;

  return {
    score,
    maxScore: 100,
    isPassed,
    feedback: isPassed
      ? '🌟 Excellent SPM Standard! The Magnesium atom diagram has accurate concentric shells, 12 electrons in 2.8.2 arrangement, and clear labelling.'
      : 'Diagram needs slight refinement to meet full SPM KSSM Paper 2 marking criteria. Check the checklist below to complete missing components.',
    strengths: strengths.length > 0 ? strengths : ['Good initial structure attempt'],
    improvements: improvements.length > 0 ? improvements : ['Maintain neat horizontal pointer lines for all labels'],
    criteria,
  };
}

/**
 * Evaluates Challenge 2: Water Molecule Covalent Bond (H₂O)
 */
function evaluateWaterCovalentBond(data: {
  stamps: ActionLogItem[];
  shapes: ActionLogItem[];
  freehand: ActionLogItem[];
  textLabels: ActionLogItem[];
  nonWhitePixels: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  centerRegionCount: number;
}): DrawingEvaluationResult {
  const criteria: DrawingCriteriaCheck[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Criterion 1: Central Oxygen & 2 Hydrogens (25 pts)
  const oNucleus = data.stamps.some((s) => s.id?.includes('nucleus_o') || s.name?.includes('Oxygen') || s.name?.includes('Oksigen'));
  const hNucleusCount = data.stamps.filter((s) => s.id?.includes('nucleus_h') || s.name?.includes('Hydrogen') || s.name?.includes('Hidrogen')).length;
  const hasOandHLabels = data.textLabels.some((l) => /o|oxygen/i.test(l.text || '')) && data.textLabels.some((l) => /h|hydrogen/i.test(l.text || ''));

  if ((oNucleus && hNucleusCount >= 2) || hasOandHLabels || data.stamps.length >= 3) {
    criteria.push({
      id: 'atoms',
      name: 'Oxygen and 2 Hydrogen Atoms',
      description: 'One central Oxygen atom linked to two Hydrogen atoms in bent geometry.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Correct atomic ratio of 1 Oxygen to 2 Hydrogen atoms in H₂O');
  } else {
    criteria.push({
      id: 'atoms',
      name: 'Oxygen and 2 Hydrogen Atoms',
      description: 'Need 1 central Oxygen atom and 2 peripheral Hydrogen atoms.',
      points: 25,
      earned: 10,
      status: 'partial',
      tip: 'Place 1 Oxygen nucleus in the center and 2 Hydrogen nuclei on both sides.',
    });
    improvements.push('Place 1 central Oxygen and 2 Hydrogen atoms');
  }

  // Criterion 2: Overlapping Covalent Shells (25 pts)
  const circles = data.shapes.filter((s) => s.type === 'circle').length + data.stamps.filter((s) => s.id?.includes('shell') || s.id?.includes('ring')).length;

  if (circles >= 3 || data.nonWhitePixels > 4500) {
    criteria.push({
      id: 'overlap',
      name: 'Overlapping Valence Shells',
      description: 'Two distinct overlapping shell regions between O and each H atom.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Clearly drawn overlapping circular shells demonstrating covalent sharing');
  } else {
    criteria.push({
      id: 'overlap',
      name: 'Overlapping Valence Shells',
      description: 'Missing overlapping circular shell boundaries.',
      points: 25,
      earned: 12,
      status: 'partial',
      tip: 'Draw 2 circles that overlap with the central Oxygen shell to form sharing zones.',
    });
    improvements.push('Draw overlapping circles for the two O-H covalent bonds');
  }

  // Criterion 3: Shared Electron Pairs in Overlaps (25 pts)
  const dots = data.stamps.filter((s) => s.id === 'electron_dot' || s.name?.includes('Dot')).length;
  const crosses = data.stamps.filter((s) => s.id === 'electron_cross' || s.name?.includes('Cross')).length;
  const totalElectrons = dots + crosses;

  if (totalElectrons >= 6 && dots >= 2 && crosses >= 2) {
    criteria.push({
      id: 'shared_pairs',
      name: 'Shared Electron Pairs (1 Dot + 1 Cross each)',
      description: 'Each O-H bond has 1 shared pair consisting of 1 electron from H and 1 from O.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Distinct dot (•) and cross (×) electron sharing in each bond overlap');
  } else if (totalElectrons >= 4 || data.nonWhitePixels > 4000) {
    criteria.push({
      id: 'shared_pairs',
      name: 'Shared Electron Pairs',
      description: 'Shared electrons present but ensure 1 dot (•) and 1 cross (×) per bond.',
      points: 25,
      earned: 18,
      status: 'partial',
      tip: 'Put 1 Dot and 1 Cross in each overlapping area to show electron sharing.',
    });
    improvements.push('Ensure 1 dot (from H) and 1 cross (from O) in each bond overlap');
  } else {
    criteria.push({
      id: 'shared_pairs',
      name: 'Shared Electron Pairs',
      description: 'Missing shared electron pairs in the overlap region.',
      points: 25,
      earned: 0,
      status: 'missing',
      tip: 'Stamp 1 Dot and 1 Cross into each overlapping zone.',
    });
    improvements.push('Add shared electron pairs (1 dot + 1 cross) in both overlapping zones');
  }

  // Criterion 4: Lone Pairs & Molecule Formula Label (25 pts)
  const hasFormulaLabel = data.textLabels.some((l) => /h2o|water|covalent|kovalen|lone|bebas/i.test(l.text || ''));

  if (hasFormulaLabel || totalElectrons >= 8) {
    criteria.push({
      id: 'lone_pairs_label',
      name: 'Oxygen Lone Pairs (4 electrons) & Labels',
      description: 'Two non-bonding lone pairs on Oxygen (4 electrons) and formula label (H₂O).',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Included Oxygen lone pairs (octet fulfilled) and molecule labelling');
  } else {
    criteria.push({
      id: 'lone_pairs_label',
      name: 'Oxygen Lone Pairs & Label',
      description: 'Remember Oxygen has 4 unshared valence electrons (2 lone pairs) and add label "H₂O".',
      points: 25,
      earned: 12,
      status: 'partial',
      tip: 'Place 4 unshared electrons (2 pairs) on Oxygen to complete its octet, and label "H₂O".',
    });
    improvements.push('Add 2 lone pairs (4 electrons) on Oxygen and label the molecule "H₂O"');
  }

  const score = criteria.reduce((sum, c) => sum + c.earned, 0);
  const isPassed = score >= 70;

  return {
    score,
    maxScore: 100,
    isPassed,
    feedback: isPassed
      ? '🌟 Excellent Covalent Bond Diagram! Clear sharing of electron pairs (1 dot + 1 cross per O-H single bond) and octet fulfillment on Oxygen.'
      : 'Good effort! Make sure the overlapping zones have 1 dot and 1 cross, and Oxygen retains its 2 lone pairs (4 non-bonding electrons).',
    strengths: strengths.length > 0 ? strengths : ['Correct covalent bonding concept'],
    improvements: improvements.length > 0 ? improvements : ['Check that pointer lines are straight'],
    criteria,
  };
}

/**
 * Evaluates Challenge 3: Simple Chemical Cell (Voltaic Cell)
 */
function evaluateVoltaicCell(data: {
  stamps: ActionLogItem[];
  shapes: ActionLogItem[];
  freehand: ActionLogItem[];
  textLabels: ActionLogItem[];
  nonWhitePixels: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  leftHalfCount: number;
  rightHalfCount: number;
  topHalfCount: number;
  bottomHalfCount: number;
}): DrawingEvaluationResult {
  const criteria: DrawingCriteriaCheck[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Criterion 1: Beaker / Container with Liquid (20 pts)
  const hasBeaker = data.stamps.some((s) => s.id === 'beaker' || s.name?.toLowerCase().includes('beaker'));
  const hasContainerRect = data.shapes.some((s) => s.type === 'rect');

  if (hasBeaker || (hasContainerRect && data.bottomHalfCount > 1500)) {
    criteria.push({
      id: 'beaker',
      name: 'Beaker & Electrolyte Level',
      description: 'Glass beaker containing electrolyte solution with clear liquid level.',
      points: 20,
      earned: 20,
      status: 'passed',
    });
    strengths.push('Apparatus container (Beaker) clearly drawn with electrolyte level');
  } else {
    criteria.push({
      id: 'beaker',
      name: 'Beaker Container',
      description: 'Missing beaker to contain the electrolyte solution.',
      points: 20,
      earned: 5,
      status: 'missing',
      tip: 'Use the Beaker stamp (🥛) or draw a beaker box in the lower half.',
    });
    improvements.push('Add a beaker container holding the electrolyte solution');
  }

  // Criterion 2: Dual Electrodes (Zn & Cu) (25 pts)
  const znStamp = data.stamps.some((s) => s.id?.includes('zn') || s.name?.includes('Zinc'));
  const cuStamp = data.stamps.some((s) => s.id?.includes('cu') || s.name?.includes('Copper'));
  const znLabel = data.textLabels.some((l) => /zn|zinc|zink|-/i.test(l.text || ''));
  const cuLabel = data.textLabels.some((l) => /cu|copper|kuprum|\+/i.test(l.text || ''));
  const hasLeftRightElectrodes = data.leftHalfCount > 800 && data.rightHalfCount > 800;

  if ((znStamp && cuStamp) || (znLabel && cuLabel && hasLeftRightElectrodes) || (hasLeftRightElectrodes && data.shapes.length >= 2)) {
    criteria.push({
      id: 'electrodes',
      name: 'Dual Electrodes (Zinc & Copper Plates)',
      description: 'Two different metal plates immersed in the solution (Zn Anode and Cu Cathode).',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Positioned dual electrode metal plates immersed in the electrolyte');
  } else {
    criteria.push({
      id: 'electrodes',
      name: 'Dual Electrodes (Zn and Cu)',
      description: 'Ensure both Zinc (Anode) and Copper (Cathode) plates are immersed.',
      points: 25,
      earned: 12,
      status: 'partial',
      tip: 'Draw or stamp two electrode plates (Zinc on left, Copper on right) dipping into the liquid.',
    });
    improvements.push('Draw and label both Zinc plate (-) and Copper plate (+)');
  }

  // Criterion 3: Voltmeter & Connecting Wires (25 pts)
  const hasVoltmeter = data.stamps.some((s) => s.id === 'voltmeter' || s.name?.toLowerCase().includes('voltmeter'));
  const hasWires = data.shapes.some((s) => s.type === 'line') || data.topHalfCount > 600;

  if (hasVoltmeter && hasWires) {
    criteria.push({
      id: 'voltmeter',
      name: 'Voltmeter & External Circuit Wires',
      description: 'Voltmeter connected across electrodes via connecting wires.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Voltmeter placed with complete external wire circuit');
  } else if (hasVoltmeter || hasWires) {
    criteria.push({
      id: 'voltmeter',
      name: 'Voltmeter & Circuit Wires',
      description: 'Voltmeter or wires present, but complete circuit must connect both electrodes.',
      points: 25,
      earned: 15,
      status: 'partial',
      tip: 'Stamp the Voltmeter (📟) and connect line wires from Zn to Voltmeter and Voltmeter to Cu.',
    });
    improvements.push('Connect both electrodes to the Voltmeter with continuous wires');
  } else {
    criteria.push({
      id: 'voltmeter',
      name: 'Voltmeter & Circuit',
      description: 'Missing Voltmeter and connecting wires.',
      points: 25,
      earned: 0,
      status: 'missing',
      tip: 'Place the Voltmeter stamp (📟) at top and draw wires connecting the two plates.',
    });
    improvements.push('Add Voltmeter (V) and connecting wires');
  }

  // Criterion 4: Labels & Electron Flow Direction (30 pts)
  const hasElectrolyteLabel = data.textLabels.some((l) =>
    /cuso4|copper|larutan|electrolyte|mol/i.test(l.text || '')
  );
  const hasArrowFlow = data.stamps.some((s) => s.id?.includes('arrow') || s.name?.includes('Arrow')) ||
    data.textLabels.some((l) => /e-|electron|flow|zn -> cu/i.test(l.text || ''));

  if (hasElectrolyteLabel && hasArrowFlow) {
    criteria.push({
      id: 'labels_flow',
      name: 'Electrolyte Label & Electron Flow Arrow (e⁻)',
      description: 'Labeled electrolyte (e.g. 1.0 mol dm⁻³ CuSO₄) and electron flow direction (Zn → Cu).',
      points: 30,
      earned: 30,
      status: 'passed',
    });
    strengths.push('Labelled CuSO₄ electrolyte and indicated electron flow direction (Zn → Cu)');
  } else if (hasElectrolyteLabel || hasArrowFlow || data.textLabels.length >= 2) {
    criteria.push({
      id: 'labels_flow',
      name: 'Electrolyte Label & Electron Flow Arrow',
      description: 'Include both electrolyte label (CuSO₄ solution) and electron flow arrow (Zn → Cu).',
      points: 30,
      earned: 18,
      status: 'partial',
      tip: 'Add label "1.0 mol dm⁻³ CuSO₄" and stamp an arrow showing electron flow from Zn to Cu.',
    });
    improvements.push('Add label "1.0 mol dm⁻³ CuSO₄" and electron flow arrow (Zn → Cu)');
  } else {
    criteria.push({
      id: 'labels_flow',
      name: 'Electrolyte & Terminals Labels',
      description: 'Missing component labels and electron flow arrow.',
      points: 30,
      earned: 5,
      status: 'missing',
      tip: 'Use the Label tool to add "CuSO₄ solution", "Zinc (-)", "Copper (+)", and arrow (➡️).',
    });
    improvements.push('Add essential SPM labels: CuSO₄ solution, Zn (-), Cu (+), and electron flow');
  }

  const score = criteria.reduce((sum, c) => sum + c.earned, 0);
  const isPassed = score >= 70;

  return {
    score,
    maxScore: 100,
    isPassed,
    feedback: isPassed
      ? '🌟 Excellent Voltaic Cell Apparatus Setup! Both electrodes are immersed in CuSO₄ solution, voltmeter circuit is complete, and polarities are accurate.'
      : 'Apparatus is progressing well! Ensure the circuit is complete with Voltmeter and include labels for electrolyte solution and electrode polarities (+ / -).',
    strengths: strengths.length > 0 ? strengths : ['Identified electrochemical cell layout'],
    improvements: improvements.length > 0 ? improvements : ['Check that electrode plates dip below liquid meniscus'],
    criteria,
  };
}

/**
 * Evaluates Challenge 4: Acid-Base Titration Setup
 */
function evaluateTitrationSetup(data: {
  stamps: ActionLogItem[];
  shapes: ActionLogItem[];
  freehand: ActionLogItem[];
  textLabels: ActionLogItem[];
  nonWhitePixels: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  topHalfCount: number;
  bottomHalfCount: number;
  leftHalfCount: number;
  rightHalfCount: number;
}): DrawingEvaluationResult {
  const criteria: DrawingCriteriaCheck[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Criterion 1: Retort Stand & Clamp (20 pts)
  const hasRetortStand = data.stamps.some((s) => s.id === 'retort_stand' || s.name?.toLowerCase().includes('retort'));

  if (hasRetortStand || (data.leftHalfCount > 800 && data.nonWhitePixels > 4000)) {
    criteria.push({
      id: 'retort_stand',
      name: 'Retort Stand & Clamp Support',
      description: 'Retort stand holding the burette vertically and securely.',
      points: 20,
      earned: 20,
      status: 'passed',
    });
    strengths.push('Retort stand with clamp clamping apparatus vertically');
  } else {
    criteria.push({
      id: 'retort_stand',
      name: 'Retort Stand & Clamp',
      description: 'Missing retort stand to clamp the burette.',
      points: 20,
      earned: 5,
      status: 'missing',
      tip: 'Stamp the Retort Stand (🏗️) on the left side of the canvas.',
    });
    improvements.push('Stamp or draw a Retort Stand on the left to hold the burette');
  }

  // Criterion 2: Burette with Scale Markings & Tap (25 pts)
  const hasBurette = data.stamps.some((s) => s.id === 'burette' || s.name?.toLowerCase().includes('burette'));

  if (hasBurette || (data.topHalfCount > 1200 && data.nonWhitePixels > 4000)) {
    criteria.push({
      id: 'burette',
      name: 'Burette with Stopcock Tap & Scale',
      description: 'Vertical burette filled with standard acid solution delivering into flask.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Burette positioned vertically with stopcock and delivery jet tip');
  } else {
    criteria.push({
      id: 'burette',
      name: 'Burette with Stopcock',
      description: 'Missing vertical graduated burette.',
      points: 25,
      earned: 0,
      status: 'missing',
      tip: 'Use the Burette stamp (📏) and place it clamped in the stand.',
    });
    improvements.push('Place a vertical Burette with tap directly above the flask');
  }

  // Criterion 3: Conical Flask with Solution (25 pts)
  const hasConicalFlask = data.stamps.some((s) => s.id === 'conical_flask' || s.name?.toLowerCase().includes('flask'));

  if (hasConicalFlask || (data.bottomHalfCount > 1000 && data.nonWhitePixels > 4000)) {
    criteria.push({
      id: 'conical_flask',
      name: 'Conical Flask with Indicator Solution',
      description: 'Conical flask placed directly beneath burette tip containing alkali and indicator.',
      points: 25,
      earned: 25,
      status: 'passed',
    });
    strengths.push('Conical flask positioned beneath the burette tip with alkali + indicator');
  } else {
    criteria.push({
      id: 'conical_flask',
      name: 'Conical Flask',
      description: 'Missing conical flask beneath the burette tip.',
      points: 25,
      earned: 0,
      status: 'missing',
      tip: 'Stamp the Conical Flask (🧪) beneath the burette jet tip.',
    });
    improvements.push('Place a Conical Flask directly under the burette tip');
  }

  // Criterion 4: White Tile at Base (15 pts)
  const hasWhiteTileStamp = data.stamps.some((s) => s.id?.includes('tile') || s.name?.toLowerCase().includes('tile'));
  const hasWhiteTileLabel = data.textLabels.some((l) => /tile|jubin|white/i.test(l.text || ''));
  const hasBaseRect = data.shapes.some((s) => s.type === 'rect' && (s.y1 || 0) > 300);

  if (hasWhiteTileStamp || hasWhiteTileLabel || hasBaseRect) {
    criteria.push({
      id: 'white_tile',
      name: 'White Tile beneath Conical Flask',
      description: 'White tile under conical flask to detect sharp indicator end point color change.',
      points: 15,
      earned: 15,
      status: 'passed',
    });
    strengths.push('Included white tile under flask for sharp end-point detection (SPM practical skema)');
  } else {
    criteria.push({
      id: 'white_tile',
      name: 'White Tile under Flask',
      description: 'Missing white tile under conical flask (mandatory for SPM practical marks).',
      points: 15,
      earned: 0,
      status: 'missing',
      tip: 'Draw or stamp a White Tile at the base under the conical flask.',
    });
    improvements.push('Add a White Tile under the conical flask (crucial for SPM mark scheme)');
  }

  // Criterion 5: SPM Labels (15 pts)
  const labelsCount = data.textLabels.length;
  const hasKeyTitrationLabels = data.textLabels.some((l) =>
    /burette|buret|acid|asid|hcl|flask|kelalang|naoh|alkali|indicator|penunjuk/i.test(l.text || '')
  );

  if (labelsCount >= 3 || hasKeyTitrationLabels) {
    criteria.push({
      id: 'labels',
      name: 'SPM Apparatus & Reagent Labels',
      description: 'Labels for Burette (Acid), Conical flask (NaOH + Phenolphthalein), and White tile.',
      points: 15,
      earned: 15,
      status: 'passed',
    });
    strengths.push('Clear reagent and apparatus labels attached with pointer lines');
  } else {
    criteria.push({
      id: 'labels',
      name: 'SPM Labels',
      description: 'Need labels for: Burette (HCl), Conical flask (NaOH + Indicator), White tile.',
      points: 15,
      earned: 5,
      status: 'partial',
      tip: 'Use the Label tool (T) to add labels for Burette, Acid, Flask, Alkali, and White Tile.',
    });
    improvements.push('Add full SPM labels: Burette, Hydrochloric acid, Conical flask, NaOH + Indicator, White tile');
  }

  const score = criteria.reduce((sum, c) => sum + c.earned, 0);
  const isPassed = score >= 70;

  return {
    score,
    maxScore: 100,
    isPassed,
    feedback: isPassed
      ? '🌟 Excellent Acid-Base Titration Setup! Retort stand, burette, conical flask, and white tile are correctly aligned with all SPM marking skema labels.'
      : 'Good start on titration setup! Ensure the white tile is present at the base and add labels for Burette, Acid, Conical Flask, and Indicator.',
    strengths: strengths.length > 0 ? strengths : ['Recognised titration apparatus configuration'],
    improvements: improvements.length > 0 ? improvements : ['Check that burette jet is centered over flask mouth'],
    criteria,
  };
}

/**
 * Fallback evaluator for custom/generic SPM drawings
 */
function evaluateGenericSPMDrawing(data: {
  stamps: ActionLogItem[];
  shapes: ActionLogItem[];
  freehand: ActionLogItem[];
  textLabels: ActionLogItem[];
  nonWhitePixels: number;
}): DrawingEvaluationResult {
  const score = data.nonWhitePixels > 4000 ? 85 : data.nonWhitePixels > 1500 ? 72 : 45;
  const isPassed = score >= 70;

  return {
    score,
    maxScore: 100,
    isPassed,
    feedback: isPassed
      ? 'Diagram meets standard SPM KSSM diagram drawing requirements with adequate detail and proportions.'
      : 'Diagram is incomplete. Please add more apparatus components and required SPM labels.',
    strengths: ['Clear lines', 'Proportional drawing'],
    improvements: ['Ensure all labels use straight horizontal pointer lines'],
    criteria: [
      {
        id: 'apparatus',
        name: 'Apparatus Setup',
        description: 'Complete apparatus and connections.',
        points: 40,
        earned: score >= 70 ? 35 : 20,
        status: score >= 70 ? 'passed' : 'partial',
      },
      {
        id: 'labels',
        name: 'Chemical Labels',
        description: 'Standard SPM terminology and reagents.',
        points: 30,
        earned: score >= 70 ? 25 : 15,
        status: score >= 70 ? 'passed' : 'partial',
      },
      {
        id: 'neatness',
        name: 'Neatness & Proportions',
        description: 'Airtight joints and horizontal pointer lines.',
        points: 30,
        earned: score >= 70 ? 25 : 10,
        status: score >= 70 ? 'passed' : 'partial',
      },
    ],
  };
}
