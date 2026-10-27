import animals from './animals.js';
import sea from './sea.js';
import dinosaurs from './dinosaurs.js';
import vehicles from './vehicles.js';
import space from './space.js';
import fantasy from './fantasy.js';
import food from './food.js';
import nature from './nature.js';
import holidays from './holidays.js';
import bugs from './bugs.js';
import farm from './farm.js';
import jobs from './jobs.js';
import alphabet from './alphabet.js';
import numbers from './numbers.js';
import patterns from './patterns.js';

export const CATEGORIES = [
  { id: 'animals', name: 'Animals', icon: '🐶', color: '#ff9f43', items: animals },
  { id: 'sea-life', name: 'Sea Life', icon: '🐠', color: '#2e86de', items: sea },
  { id: 'dinosaurs', name: 'Dinosaurs', icon: '🦕', color: '#10ac84', items: dinosaurs },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗', color: '#ee5253', items: vehicles },
  { id: 'space', name: 'Space', icon: '🚀', color: '#5f27cd', items: space },
  { id: 'fantasy', name: 'Fairy Tale', icon: '🦄', color: '#f368e0', items: fantasy },
  { id: 'food', name: 'Food', icon: '🍕', color: '#feca57', items: food },
  { id: 'nature', name: 'Nature & Flowers', icon: '🌻', color: '#1dd1a1', items: nature },
  { id: 'holidays', name: 'Holidays & Seasons', icon: '🎁', color: '#ff6b6b', items: holidays },
  { id: 'bugs', name: 'Bugs', icon: '🐞', color: '#ff9ff3', items: bugs },
  { id: 'farm', name: 'Farm', icon: '🐮', color: '#c8a165', items: farm },
  { id: 'jobs', name: 'Community Helpers', icon: '🚒', color: '#54a0ff', items: jobs },
  { id: 'alphabet', name: 'Alphabet', icon: '🔤', color: '#ff7f50', items: alphabet },
  { id: 'numbers', name: 'Numbers', icon: '🔢', color: '#48dbfb', items: numbers },
  { id: 'patterns', name: 'Shapes & Mandalas', icon: '🌀', color: '#a29bfe', items: patterns },
];

import { SHOWCASE } from './showcase.js';

for (const { category, item } of SHOWCASE) {
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) throw new Error(`Unknown showcase category ${category}`);
  cat.items.unshift(item);
}
