import type { Winner } from '../types';

const WINNERS_KEY = 'contest_winners';

export const getWinners = (): Winner[] => {
  const stored = localStorage.getItem(WINNERS_KEY);
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

export const saveWinners = (winners: Winner[]): void => {
  localStorage.setItem(WINNERS_KEY, JSON.stringify(winners));
};

export const addWinner = (winner: Omit<Winner, 'id' | 'drawDate'>): Winner => {
  const winners = getWinners();
  const newWinner: Winner = {
    ...winner,
    id: Date.now().toString(),
    drawDate: new Date()
  };
  
  winners.push(newWinner);
  saveWinners(winners);
  return newWinner;
};

export const clearWinners = (): void => {
  localStorage.removeItem(WINNERS_KEY);
};