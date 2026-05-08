import { ALGORITHMS } from './algorithms';

const WORLD_NAMES = {
  1: 'Bubble Bay',
  2: 'Selection Summit',
  3: 'Insertion Isle',
  4: 'Merge Mountain',
  5: 'Quick Quest',
};

export const LEVELS = (() => {
  const levels = [];
  let id = 1;

  const worldDefs = [
    { world: 1, algorithm: 'bubble', configs: [
      { size: 3, time: 45, tutorial: true },
      { size: 4, time: 60, tutorial: false },
      { size: 4, time: 50, tutorial: false },
      { size: 5, time: 90, tutorial: false },
      { size: 5, time: 75, tutorial: false },
      { size: 6, time: 120, tutorial: false },
    ]},
    { world: 2, algorithm: 'selection', configs: [
      { size: 4, time: 60, tutorial: true },
      { size: 5, time: 90, tutorial: false },
      { size: 5, time: 75, tutorial: false },
      { size: 6, time: 120, tutorial: false },
      { size: 6, time: 100, tutorial: false },
      { size: 7, time: 150, tutorial: false },
    ]},
    { world: 3, algorithm: 'insertion', configs: [
      { size: 4, time: 60, tutorial: true },
      { size: 5, time: 90, tutorial: false },
      { size: 5, time: 75, tutorial: false },
      { size: 6, time: 120, tutorial: false },
      { size: 6, time: 100, tutorial: false },
      { size: 7, time: 150, tutorial: false },
    ]},
    { world: 4, algorithm: 'merge', configs: [
      { size: 4, time: 90, tutorial: true },
      { size: 5, time: 120, tutorial: false },
      { size: 5, time: 100, tutorial: false },
      { size: 6, time: 150, tutorial: false },
      { size: 6, time: 130, tutorial: false },
      { size: 7, time: 180, tutorial: false },
    ]},
    { world: 5, algorithm: 'quick', configs: [
      { size: 4, time: 90, tutorial: true },
      { size: 5, time: 120, tutorial: false },
      { size: 5, time: 100, tutorial: false },
      { size: 6, time: 150, tutorial: false },
      { size: 6, time: 130, tutorial: false },
      { size: 7, time: 180, tutorial: false },
    ]},
  ];

  for (const wd of worldDefs) {
    for (const cfg of wd.configs) {
      levels.push({
        id: id++,
        world: wd.world,
        worldName: WORLD_NAMES[wd.world],
        algorithm: wd.algorithm,
        arraySize: cfg.size,
        time: cfg.time,
        tutorial: cfg.tutorial,
      });
    }
  }
  return levels;
})();

export function getLevel(levelId) {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return null;
  const algo = ALGORITHMS[level.algorithm];
  return { ...level, algorithmConfig: algo };
}

export function getLevelsForWorld(worldId) {
  return LEVELS.filter(l => l.world === worldId);
}

export function isLevelUnlocked(levelId, progress) {
  if (levelId === 1) return true;
  const prev = progress[levelId - 1];
  return prev && prev.completed;
}
