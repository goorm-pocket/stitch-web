import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../api/board";

export function useGetBoardQuery(platform: "WEB" | "APP") {
  return useQuery({
    queryKey: ["board", platform],
    queryFn: () => getBoard({ platform }),
    enabled: !!platform,
  });
}
