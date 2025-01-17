import * as util from './util.js';
import * as cg from './types.js';

type Mobility = (x1: number, y1: number, x2: number, y2: number) => boolean;

const diff = (a: number, b: number): number => Math.abs(a - b);

const pawn =
  (color: cg.Color): Mobility =>
  (x1, y1, x2, y2) =>
    diff(x1, x2) < 2 &&
    (color === 'white'
      ? // allow 2 squares from first two ranks, for horde
        y2 === y1 + 1 || (y1 <= 1 && y2 === y1 + 2 && x1 === x2)
      : y2 === y1 - 1 || (y1 >= 6 && y2 === y1 - 2 && x1 === x2));

export const knight: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
};

export const bishop: Mobility = (x1, y1, x2, y2) => {
  return diff(x1, x2) === diff(y1, y2);
};

const rook: Mobility = (x1, y1, x2, y2) => {
  return x1 === x2 || y1 === y2;
};

export const queen: Mobility = (x1, y1, x2, y2) => {
  return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
};

const king =
  (color: cg.Color, rookFiles: number[], canCastle: boolean): Mobility =>
  (x1, y1, x2, y2) =>
    (diff(x1, x2) < 2 && diff(y1, y2) < 2) ||
    (canCastle &&
      y1 === y2 &&
      y1 === (color === 'white' ? 0 : 7) &&
      ((x1 === 4 && ((x2 === 2 && rookFiles.includes(0)) || (x2 === 6 && rookFiles.includes(7)))) ||
        rookFiles.includes(x2)));

function rookFilesOf(pieces: cg.Pieces, color: cg.Color) {
  const backrank = color === 'white' ? '1' : '8';
  const files = [];
  for (const [key, piece] of pieces) {
    if (key[1] === backrank && piece.color === color && piece.role === 'rook') {
      files.push(util.key2pos(key)[0]);
    }
  }
  return files;
}

export function premove(pieces: cg.Pieces, key: cg.Key, canCastle: boolean): cg.Key[] {
  const piece = pieces.get(key);
  if (!piece) return [];
  const pos = util.key2pos(key),
    r = piece.role,
    mobility: Mobility =
      r === 'pawn'
        ? pawn(piece.color)
        : r === 'knight'
        ? knight
        : r === 'bishop'
        ? bishop
        : r === 'rook'
        ? rook
        : r === 'queen'
        ? queen
        : r === 'king'
        ? king(piece.color, rookFilesOf(pieces, piece.color), canCastle)
        : r === 'valet'
        ? valet
        : r === 'elephant'
        ? elephant
        : r === 'fool'
        ? fool
        : r === 'warden'
        ? warden
        : r === 'prince'
        ? prince
        : r === 'lady'
        ? lady
        : r === 'dragon'
        ? dragon
        : r === 'arma'
        ? arma
        : r === 'monk'
        ? monk
        : r === 'goshawk'
        ? goshawk
        : r === 'unicorn'
        ? unicorn
        : r === 'cannon'
        ? cannon
        : r === 'junk'
        ? junk
        : r === 'zebra'
        ? zebra
        : standard;
  return util.allPos
    .filter(pos2 => (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]))
    .map(util.pos2key);
}

export const valet: Mobility = (x1, y1, x2, y2) => {
  return diff(x1, x2) < 2 && diff(y1, y2) < 2;
};


export const elephant: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return xd === yd && xd === 2;
};

export const fool: Mobility = (x1, y1, x2, y2) => diff(x1, x2) === diff(y1, y2) && diff(x1, x2) === 1;

export const warden: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 0) || (xd === 0 && yd === 1);
};

export const prince: Mobility = (x1, y1, x2, y2) => {
  return valet(x1, y1, x2, y2) || knight(x1, y1, x2, y2);
};

export const lady: Mobility = (x1, y1, x2, y2) => {
  return bishop(x1, y1, x2, y2) || warden(x1, y1, x2, y2);
};

export const dragon: Mobility = (x1, y1, x2, y2) => {
  return knight(x1, y1, x2, y2) || queen(x1, y1, x2, y2);
};

export const arma: Mobility = (x1, y1, x2, y2) => {
  return rook(x1, y1, x2, y2) || fool(x1, y1, x2, y2);
};

export const monk: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 2 && yd === 0) || (xd === 0 && yd === 2);
};

// The standard can't move at all
// @ts-expect-error
export const standard: Mobility = (x1, y1, x2, y2) => {
  return false;
}

export const goshawk: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 3) || (xd === 3 && yd === 1);
};

export const cannon: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 3 && yd === 0) || (xd === 0 && yd === 3);
};

// @ts-expect-error
export const junk: Mobility = (x1, y1, x2, y2) => {
  return y1 === y2;
};

export const zebra: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1) || (xd === 1 && yd === 0);
};

export const unicorn: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  const demominator = Math.min(xd, yd);
  const xn = xd / demominator;
  const yn = yd / demominator;
  return (xn === 1 && yn === 2) || (xn === 2 && yn === 1);
};