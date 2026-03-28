import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoard, getRecapBoard, readBoardPost } from "../api/board";

export function useGetBoardQuery(platform: "WEB" | "APP") {
  return useQuery({
    queryKey: ["board"],
    queryFn: () => getBoard({ platform }),
    enabled: !!platform,
  });
}

export function useGetRecapBoardQuery(weekStartDate?: string) {
  return useQuery({
    queryKey: ["recap-board", weekStartDate],
    queryFn: () => getRecapBoard({ weekStartDate }),
    enabled: !!weekStartDate,
  });
}

export function useReadBoardPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readBoardPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });
}
