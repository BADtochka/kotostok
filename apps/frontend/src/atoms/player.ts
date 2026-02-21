import type { PlayerData } from "@shared";
import { atomWithStorage } from "jotai/utils";

export const playerAtom = atomWithStorage<PlayerData | null>("player", null);
