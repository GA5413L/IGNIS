/**
 * Example questions. Choosing one fills the question box and a structured request preset; the assessment still
 * runs on the reviewed registry through the same engine. These are not prerecorded answers.
 */
import type { FormChoices } from '../core/interpretation';

export interface Example { label: string; question: string; form: FormChoices }

export const EXAMPLES: Example[] = [
  { label: 'Broad brief: oxygen-enriched, lower-pressure crew environment',
    question: 'What NASA findings should I consider for material burning, smoke detection and extinction in an oxygen-enriched, lower-pressure crew environment?',
    form: { intent: 'synthesize_findings', safetyAreas: [] } },
  { label: 'Detection: smoke particle sizes and detector response',
    question: 'Which investigation addresses smoke particle sizes relevant to detector response?',
    form: { intent: 'synthesize_findings', safetyAreas: ['detection'] } },
  { label: 'Suppression: is visible flame loss complete extinction?',
    question: 'Can visible droplet-flame disappearance alone define complete extinction?',
    form: { intent: 'synthesize_findings', safetyAreas: ['suppression'], endpointIds: ['EP-COMPLETE-EXTINCTION'] } },
  { label: 'Saffire VI model: what tests its later CO₂ response?',
    question: 'Which measurements can test the later remote CO₂ response of the published Saffire VI two-sided-PMMA transport model?',
    form: { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'], quantityIds: ['Q-CO2-REMOTE-CONC'], requestedClaim: 'conditional_response', temporalScope: 'subsequent', requestedFeature: 'change' } },
  { label: 'Saffire V model: was the CO₂ total independently predicted?',
    question: 'Does agreement in the normalized Saffire V source total show that the total was independently predicted? What can still be compared?',
    form: { intent: 'assess_physical_model', physicalModelId: 'PM-SV24', quantityIds: ['Q-CO2-SOURCE-TOTAL'], requestedClaim: 'independent_prediction', temporalScope: 'unspecified' } },
  { label: 'Saffire VI model: does it predict chemical heat release?',
    question: 'Keep that published Saffire VI transport model, but now assess whether it independently predicts PMMA chemical heat release.',
    form: { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'], quantityIds: ['Q-HEAT-CHEMICAL-RELEASE'], requestedClaim: 'independent_prediction', temporalScope: 'unspecified' } },
  { label: 'Second NASA input: SIBAL burn CO₂ totals',
    question: 'How close are the SIBAL burn’s source and remote CO₂ totals in the Saffire VI model, and what does that show?',
    form: { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-5'], quantityIds: ['Q-CO2-SOURCE-TOTAL'], requestedClaim: 'description', temporalScope: 'unspecified' } },
  { label: 'Unsupported action: run a new simulation',
    question: 'Run a new Mars cabin fire simulation using my PDF.',
    form: { intent: 'request_execution', requestedExecutionText: 'Run a new Mars cabin fire simulation using my PDF.' } },
];
