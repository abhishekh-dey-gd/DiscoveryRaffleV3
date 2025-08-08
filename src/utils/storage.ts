import type { Winner, DrawType } from '../types';

const WINNERS_70_KEY = 'contest_winners_70';
const WINNERS_80_KEY = 'contest_winners_80';

const getStorageKey = (drawType: DrawType): string => {
  return drawType === 'discovery-70' ? WINNERS_70_KEY : WINNERS_80_KEY;
};

export const getWinners = (drawType?: DrawType): Winner[] => {
  if (!drawType) {
    // Return all winners from both draws
    const winners70 = getWinners('discovery-70');
    const winners80 = getWinners('discovery-80');
    return [...winners70, ...winners80].sort((a, b) => 
      new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()
    );
  }

  const stored = localStorage.getItem(getStorageKey(drawType));
  if (!stored) return [];
  
  try {
    const winners = JSON.parse(stored);
    return winners.map((winner: any) => ({
      ...winner,
      drawDate: new Date(winner.drawDate)
    }));
  } catch {
    return [];
  }
};

export const saveWinners = (winners: Winner[], drawType: DrawType): void => {
  localStorage.setItem(getStorageKey(drawType), JSON.stringify(winners));
};

export const addWinner = (winner: Omit<Winner, 'id' | 'drawDate'>, drawType: DrawType): Winner => {
  const winners = getWinners(drawType);
  const newWinner: Winner = {
    ...winner,
    id: Date.now().toString(),
    drawDate: new Date(),
    drawType
  };
  
  winners.push(newWinner);
  saveWinners(winners, drawType);
  return newWinner;
};

export const clearWinners = (drawType?: DrawType): void => {
  if (!drawType) {
    // Clear both draws
    localStorage.removeItem(WINNERS_70_KEY);
    localStorage.removeItem(WINNERS_80_KEY);
  } else {
    localStorage.removeItem(getStorageKey(drawType));
  }
};