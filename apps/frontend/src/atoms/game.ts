import type { GameData } from "@shared";
import { atom } from "jotai";

export const gameAtom = atom<GameData | null>(null);
