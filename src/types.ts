export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  rarity: 'common' | 'rare' | 'cursed';
}

export type EnvType = 'NORMAL' | 'BLIZZARD' | 'TOXIC_FOG' | 'BLOOD_RAIN' | 'APPARITION_RISE' | 'DEATHLY_SILENCE';

export interface Environment {
  type: EnvType;
  name: string;
  description: string;
  dangerLevel: 'low' | 'medium' | 'high' | 'deadly';
  color: string;
  effectText: string;
  sanCostMultiplier: number;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  discoveredAtLoop: number;
}

export interface HistoryLog {
  timestamp: string;
  text: string;
  type: 'action' | 'damage' | 'heal' | 'system' | 'clue';
}

export interface GameChoice {
  text: string;
  next: string;
  sanDelta?: number;
  loopDelta?: number;
  requireItem?: string;
  removeItem?: boolean;
  gainItem?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'cursed';
  };
  requireSan?: number;
  requireClue?: string;
  discoverClue?: {
    id: string;
    title: string;
    description: string;
  };
}

export interface PuzzleConfig {
  type: 'keypad' | 'sequence' | 'symbols';
  question: string;
  hint: string;
  correctAnswer: string;
  onSuccessNode: string;
  onFailNode: string;
  failSanityDamage: number;
}

export interface LevelNode {
  id: string;
  title: string;
  desc: string;
  atmosphere?: string;
  isEnding?: boolean;
  isDeath?: boolean;
  endingTitle?: string;
  endingMsg?: string;
  deathMsg?: string;
  choices?: GameChoice[];
  puzzle?: PuzzleConfig;
}
