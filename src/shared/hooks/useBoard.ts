import { useMutation, useQuery } from "@tanstack/react-query";
import { getBoard, readBoardPost } from "../api/board";

export function useGetBoardQuery(platform: "WEB" | "APP") {
  return useQuery({
    queryKey: ["board", platform],
    queryFn: () => getBoard({ platform }),
    enabled: !!platform,
  });
}

export function useReadBoardPostMutation() {
  return useMutation({
    mutationFn: readBoardPost,
  });
}
