import { useGetCalendarByIdQuery, useGetCalendarQuery } from "@/shared/hooks/usePost";

interface UseArchiveCalendarParams {
  year: number;
  month: number;
  userId?: string;
}

export function useArchiveCalendar({ year, month, userId }: UseArchiveCalendarParams) {
  const myCalendarQuery = useGetCalendarQuery({ year, month });

  const userCalendarQuery = useGetCalendarByIdQuery({ year, month, userId: userId as string });

  return userId ? userCalendarQuery : myCalendarQuery;
}
