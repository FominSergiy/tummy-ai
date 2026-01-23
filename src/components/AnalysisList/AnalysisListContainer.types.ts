import { AnalysisHistoryItem } from '../../services/api.service';

export type FilterMode = 'today' | 'historical';

export type ListItem =
  | { type: 'analysis'; data: AnalysisHistoryItem }
  | { type: 'dateHeader'; date: string };
