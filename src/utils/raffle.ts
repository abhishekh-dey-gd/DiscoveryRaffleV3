import type { Contestant, Department } from '../types';
import contestantsData from '../data/contestants.json';

export const getAllContestants = (): Contestant[] => {
  return contestantsData as Contestant[];
};

export const getContestantsByDepartment = (department: Department): Contestant[] => {
  return getAllContestants().filter(c => c.department === department);
};

export const drawWinners = (
  pool: Contestant[], 
  count: number, 
  excludeWinners: string[] = []
): Contestant[] => {
  const availablePool = pool.filter(c => !excludeWinners.includes(c.name));
  
  if (availablePool.length < count) {
    return availablePool;
  }

  const winners: Contestant[] = [];
  const shuffled = [...availablePool];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * shuffled.length);
    winners.push(shuffled.splice(randomIndex, 1)[0]);
  }

  return winners;
};

export const exportToCSV = (winners: any[]): void => {
  const headers = ['Name', 'Department', 'Supervisor', 'Draw Date'];
  const csvContent = [
    headers.join(','),
    ...winners.map(winner => [
      winner.name,
      winner.department,
      winner.supervisor,
      new Date(winner.drawDate).toLocaleDateString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contest-winners.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};