import {
  ChatMessage,
  StructuredAdvisory,
  QuickPromptOption,
  FarmProfileInput,
  CropRecommendationItem,
} from '../types/ai';

export const FIGMA_CROP_RECOMMENDATIONS: CropRecommendationItem[] = [
  {
    id: 'crop-rec-rice',
    cropName: 'Rice (Paddy)',
    cropNameKey: 'aiAdvisor.cropAdvisor.rice.name',
    cropSubName: 'Oryza sativa',
    matchPercent: 98,
    expectedYield: '22–25 Quintals/Acre',
    marketDemand: 'High',
    marketDemandKey: 'aiAdvisor.cropAdvisor.demandHigh',
    estNetIncome: '₹45,000 - ₹52,000',
    description: 'Perfect match for black soil with stable canal water supply.',
    descriptionKey: 'aiAdvisor.cropAdvisor.rice.description',
    soilSuitabilityKey: 'aiAdvisor.cropAdvisor.rice.soilSuitability',
    recommendedVarieties: ['BPT-5204 (Samba Mahsuri)', 'MTU-1010', 'RNR-15048 (Telangana Sona)'],
    sowingWindowKey: 'aiAdvisor.cropAdvisor.rice.sowingWindow',
    durationDays: '125-135 Days',
  },
  {
    id: 'crop-rec-cotton',
    cropName: 'Cotton',
    cropNameKey: 'aiAdvisor.cropAdvisor.cotton.name',
    cropSubName: 'Gossypium hirsutum',
    matchPercent: 92,
    expectedYield: '10–12 Quintals/Acre',
    marketDemand: 'High',
    marketDemandKey: 'aiAdvisor.cropAdvisor.demandHigh',
    estNetIncome: '₹40,000 - ₹48,000',
    description: 'Highly suitable, requires moderate irrigation during flowering.',
    descriptionKey: 'aiAdvisor.cropAdvisor.cotton.description',
    soilSuitabilityKey: 'aiAdvisor.cropAdvisor.cotton.soilSuitability',
    recommendedVarieties: ['RCH-2 Bt-II', 'Bunny Bt-II', 'Mallika Bt-II'],
    sowingWindowKey: 'aiAdvisor.cropAdvisor.cotton.sowingWindow',
    durationDays: '150-165 Days',
  },
  {
    id: 'crop-rec-maize',
    cropName: 'Maize (Corn)',
    cropNameKey: 'aiAdvisor.cropAdvisor.maize.name',
    cropSubName: 'Zea mays',
    matchPercent: 85,
    expectedYield: '18–20 Quintals/Acre',
    marketDemand: 'Medium',
    marketDemandKey: 'aiAdvisor.cropAdvisor.demandMedium',
    estNetIncome: '₹30,000 - ₹38,000',
    description: 'Good secondary crop, quick harvest cycle with lower budget.',
    descriptionKey: 'aiAdvisor.cropAdvisor.maize.description',
    soilSuitabilityKey: 'aiAdvisor.cropAdvisor.maize.soilSuitability',
    recommendedVarieties: ['Pioneer 3396', 'NK 6240', 'DHM 117'],
    sowingWindowKey: 'aiAdvisor.cropAdvisor.maize.sowingWindow',
    durationDays: '100-110 Days',
  },
];


/**
 * AI Advisor Service for RaituSevak360 Farmer Module
 * 
 * Provides agronomic advisory processing, query classification, and structured remedy recommendations.
 * Cleanly separates UI from backend integration.
 */

export const QUICK_PROMPTS: QuickPromptOption[] = [
  {
    id: 'paddy-blast',
    labelKey: 'aiAdvisor.prompts.paddyBlast',
    queryText: 'How to control leaf blast and stem borer in paddy?',
  },
  {
    id: 'cotton-bollworm',
    labelKey: 'aiAdvisor.prompts.cottonBollworm',
    queryText: 'Remedies for pink bollworm and whitefly in cotton crop',
  },
  {
    id: 'chilli-curl',
    labelKey: 'aiAdvisor.prompts.chilliCurl',
    queryText: 'Treatment for chilli leaf curl virus and thrips infestation',
  },
  {
    id: 'neem-spray',
    labelKey: 'aiAdvisor.prompts.neemSpray',
    queryText: 'How to prepare organic neem seed kernel extract (NSKE)?',
  },
  {
    id: 'drainage-advisory',
    labelKey: 'aiAdvisor.prompts.drainage',
    queryText: 'Precautionary steps for waterlogged fields after heavy rain',
  },
];

const ADVISORIES: Record<string, StructuredAdvisory> = {
  paddy: {
    id: 'adv-paddy-01',
    cropNameKey: 'aiAdvisor.crops.paddy',
    cropStageKey: 'aiAdvisor.stages.tillering',
    category: 'pest',
    titleKey: 'aiAdvisor.advisories.paddy.title',
    diagnosisKey: 'aiAdvisor.advisories.paddy.diagnosis',
    severity: 'high',
    confidencePercent: 94,
    symptomsKeys: [
      'aiAdvisor.advisories.paddy.symptom1',
      'aiAdvisor.advisories.paddy.symptom2',
    ],
    remediesKeys: [
      'aiAdvisor.advisories.paddy.remedy1',
      'aiAdvisor.advisories.paddy.remedy2',
      'aiAdvisor.advisories.paddy.remedy3',
    ],
    preventiveTipsKeys: [
      'aiAdvisor.advisories.paddy.preventive1',
    ],
  },
  cotton: {
    id: 'adv-cotton-01',
    cropNameKey: 'aiAdvisor.crops.cotton',
    cropStageKey: 'aiAdvisor.stages.flowering',
    category: 'pest',
    titleKey: 'aiAdvisor.advisories.cotton.title',
    diagnosisKey: 'aiAdvisor.advisories.cotton.diagnosis',
    severity: 'high',
    confidencePercent: 91,
    symptomsKeys: [
      'aiAdvisor.advisories.cotton.symptom1',
      'aiAdvisor.advisories.cotton.symptom2',
    ],
    remediesKeys: [
      'aiAdvisor.advisories.cotton.remedy1',
      'aiAdvisor.advisories.cotton.remedy2',
    ],
    preventiveTipsKeys: [
      'aiAdvisor.advisories.cotton.preventive1',
    ],
  },
  chilli: {
    id: 'adv-chilli-01',
    cropNameKey: 'aiAdvisor.crops.chilli',
    cropStageKey: 'aiAdvisor.stages.vegetative',
    category: 'disease',
    titleKey: 'aiAdvisor.advisories.chilli.title',
    diagnosisKey: 'aiAdvisor.advisories.chilli.diagnosis',
    severity: 'moderate',
    confidencePercent: 89,
    symptomsKeys: [
      'aiAdvisor.advisories.chilli.symptom1',
      'aiAdvisor.advisories.chilli.symptom2',
    ],
    remediesKeys: [
      'aiAdvisor.advisories.chilli.remedy1',
      'aiAdvisor.advisories.chilli.remedy2',
    ],
    preventiveTipsKeys: [
      'aiAdvisor.advisories.chilli.preventive1',
    ],
  },
  general: {
    id: 'adv-general-01',
    cropNameKey: 'aiAdvisor.crops.general',
    category: 'general',
    titleKey: 'aiAdvisor.advisories.general.title',
    diagnosisKey: 'aiAdvisor.advisories.general.diagnosis',
    severity: 'moderate',
    confidencePercent: 88,
    symptomsKeys: [
      'aiAdvisor.advisories.general.symptom1',
    ],
    remediesKeys: [
      'aiAdvisor.advisories.general.remedy1',
      'aiAdvisor.advisories.general.remedy2',
    ],
  },
};

export const aiAdvisorService = {
  /**
   * Process a farmer query (text or image) and generate agronomic advice
   */
  async askAdvisor(
    queryText: string,
    hasImageAttachment = false
  ): Promise<{ responseTextKey: string; advisory?: StructuredAdvisory }> {
    // Simulate real AI processing latency (400-600ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const normalized = queryText.toLowerCase();

    if (hasImageAttachment) {
      return {
        responseTextKey: 'aiAdvisor.responses.imageAnalyzed',
        advisory: normalized.includes('cotton')
          ? ADVISORIES.cotton
          : normalized.includes('chilli')
          ? ADVISORIES.chilli
          : ADVISORIES.paddy,
      };
    }

    if (normalized.includes('paddy') || normalized.includes('rice') || normalized.includes('వరి') || normalized.includes('धान')) {
      return {
        responseTextKey: 'aiAdvisor.responses.paddyAnalysis',
        advisory: ADVISORIES.paddy,
      };
    }

    if (normalized.includes('cotton') || normalized.includes('పత్తి') || normalized.includes('कपास')) {
      return {
        responseTextKey: 'aiAdvisor.responses.cottonAnalysis',
        advisory: ADVISORIES.cotton,
      };
    }

    if (normalized.includes('chilli') || normalized.includes('chili') || normalized.includes('మిర్చి') || normalized.includes('मिर्च')) {
      return {
        responseTextKey: 'aiAdvisor.responses.chilliAnalysis',
        advisory: ADVISORIES.chilli,
      };
    }

    if (normalized.includes('neem') || normalized.includes('organic') || normalized.includes('వేప') || normalized.includes('नीम')) {
      return {
        responseTextKey: 'aiAdvisor.responses.organicAnalysis',
        advisory: ADVISORIES.general,
      };
    }

    if (normalized.includes('rain') || normalized.includes('water') || normalized.includes('drain') || normalized.includes('వర్షం') || normalized.includes('बारिश')) {
      return {
        responseTextKey: 'aiAdvisor.responses.weatherDrainageAnalysis',
        advisory: ADVISORIES.general,
      };
    }

    // Default agronomy guidance
    return {
      responseTextKey: 'aiAdvisor.responses.generalAnalysis',
      advisory: ADVISORIES.general,
    };
  },

  /**
   * AI Crop Advisor: Generate best crop recommendations based on farm profile parameters.
   * Currently provides Figma demonstration/mock data until production ML model integration.
   */
  async getCropRecommendations(
    profile: FarmProfileInput
  ): Promise<CropRecommendationItem[]> {
    // Simulate recommendation calculation latency
    await new Promise((resolve) => setTimeout(resolve, 450));

    // If farmer selected specific crop preferences, we can order or filter them;
    // By default, provide the 3 approved Figma recommendations (Rice, Cotton, Maize).
    const preferences = profile.cropPreferences.map((p) => p.toLowerCase());

    if (preferences.length > 0) {
      // Prioritize crops matching user preference
      const matched = FIGMA_CROP_RECOMMENDATIONS.filter((item) =>
        preferences.some((pref) => item.cropName.toLowerCase().includes(pref))
      );
      const remaining = FIGMA_CROP_RECOMMENDATIONS.filter(
        (item) => !matched.some((m) => m.id === item.id)
      );
      return [...matched, ...remaining];
    }

    return FIGMA_CROP_RECOMMENDATIONS;
  },
};

export default aiAdvisorService;

