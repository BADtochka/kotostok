import { makeRequest } from "@/constants/apiClient";
import type { CreateGameRequest, GameData, MakeTurnRequest } from "@shared";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateGame = () =>
  useMutation({
    mutationFn: (data: CreateGameRequest) =>
      makeRequest<GameData>({
        url: "/game/create",
        method: "POST",
        data,
      }),
  });

export const useGetGame = (id: string) =>
  useQuery({
    queryKey: ["game", id],
    queryFn: () => makeRequest<GameData>({ url: `/game/${id}` }),
  });

export const useMakeTurn = (id: string) =>
  useMutation({
    mutationKey: ["game", id, "turn"],
    mutationFn: (data: MakeTurnRequest) =>
      makeRequest<GameData>({
        url: `/game/${id}/turn`,
        method: "POST",
        data,
      }),
  });

export const useEndGame = (id: string) =>
  useMutation({
    mutationFn: () =>
      makeRequest<GameData>({
        url: `/game/${id}/end`,
        method: "POST",
      }),
  });
