import type { GameData } from "@shared";
import { atomWithStorage } from "jotai/utils";

export const gameAtom = atomWithStorage<GameData | null>("game", null);
