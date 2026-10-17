/**
 * Digitized CSA Code & Engineering Library TypeScript types
 */

export interface CsaClause {
  id: string;
  clauseNumber: string;
  title: string;
  text: string;
  section: string;
  standardId: string;
  standardName: string;
  edition: string;
  page?: number;
  tablesReferenced?: Array<string | { tableId?: string; tableNumber?: string; title?: string; standardId?: string; [key: string]: unknown }>;
  clausesReferenced?: string[];
  crossReferences?: string[];
  canadianDeviation?: string | null;
  tags?: string[];
  takeaways?: string[];
  isLesson?: boolean;
  lesson?: PlsLesson;
}

export interface CsaTable {
  id: string;
  key: string;
  number: string;
  title: string;
  section?: string;
  standardId: string;
  standardName: string;
  edition: string;
  page?: number;
  unit?: string;
  details?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface CsaDefinition {
  id: string;
  term: string;
  definition: string;
  standardId: string;
  standardName: string;
  section?: string;
}

export interface StandardBookMeta {
  id: string;
  code?: string;
  title: string;
  edition?: string;
  year?: number;
  organization?: string;
  status?: string;
  scopeSummary?: string;
  scope?: string;
  clauseCount: number;
  tableCount: number;
  definitionCount?: number;
  accentColor?: string;
  accentDark?: string;
  isDialogueBook?: boolean;
}


export interface PlsDialogueTurn {
  speaker: string;
  name: string;
  role: string;
  text: string;
}

export interface PlsLesson {
  id: string;
  lessonNumber: number;
  clauseNumber: string;
  title: string;
  section: string;
  standardId: string;
  standardName: string;
  dialogue: PlsDialogueTurn[];
  proTip: string;
  plsCommands: string[];
  csaCitations: string[];
}
