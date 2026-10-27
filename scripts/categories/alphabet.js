import { glyphPath, glyphWidth } from '../lib/font.js';
import { frame } from '../lib/parts.js';
import { mini } from '../lib/minis.js';
import { star } from '../lib/shapes.js';

const WORDS = {
  A: ['Apple', 'apple'], B: ['Ball', 'ball'], C: ['Cat', 'cat'], D: ['Donut', 'donut'], E: ['Egg', 'egg'],
  F: ['Fish', 'fish'], G: ['Gift', 'gift'], H: ['Hat', 'hat'], I: ['Igloo', 'igloo'], J: ['Jellyfish', 'jellyfish'],
  K: ['Kite', 'kite'], L: ['Leaf', 'leaf'], M: ['Moon', 'moon'], N: ['Nest', 'nest'], O: ['Owl', 'owl'],
  P: ['Pear', 'pear'], Q: ['Queen’s Crown', 'queen'], R: ['Rocket', 'rocket'], S: ['Sun', 'sun'], T: ['Tree', 'tree'],
  U: ['Umbrella', 'umbrella'], V: ['Van', 'van'], W: ['Watermelon', 'watermelon'], X: ['Xylophone', 'xylophone'],
  Y: ['Yo-yo', 'yoyo'], Z: ['Zebra', 'zebra'],
};

export default Object.entries(WORDS).map(([letter, [word, obj]]) => ({
  name: `letter-${letter.toLowerCase()}`,
  title: `${letter} is for ${word}`,
  tags: ['letter', 'alphabet', 'abc', letter.toLowerCase(), word.toLowerCase(), 'learning'],
  anim: 'wiggle',
  difficulty: 'easy',
  draw(a) {
    frame(a);
    const h = 370;
    const w = (glyphWidth(letter) / 14) * h;
    a.anim('wiggle', () => a.fe(glyphPath(letter, 245 - w / 2, 115, h, 1.6)));
    mini(a, obj, 590, 500, 0.42);
    a.f(star(660, 120, 50, 22));
    a.text(400, 735, `${letter} is for ${word}`, 58);
  },
}));
