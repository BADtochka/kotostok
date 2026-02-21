import { makeRequest } from "@/constants/apiClient";
import type { CreatePlayerRequest, PlayerData } from "@shared";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreatePlayer = () =>
  useMutation({
    mutationFn: (data: CreatePlayerRequest) =>
      makeRequest<PlayerData>({
        url: "/player/create",
        method: "POST",
        data,
      }),
  });

export const useGetAllPlayers = () =>
  useQuery({
    queryKey: ["players"],
    queryFn: () => makeRequest<PlayerData[]>({ url: "/player/all" }),
  });
