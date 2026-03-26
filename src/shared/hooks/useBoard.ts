import { useQuery } from "@tanstack/react-query";
import { getBoard, getRecapBoard } from "../api/board";

export function useGetBoardQuery(platform: "WEB" | "APP") {
  return useQuery({
    queryKey: ["board", platform],
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
