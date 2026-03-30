import { useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import DayCell from "./components/DayCell";
import ArchivePostSlider from "../../features/ArchivePostSlider/ArchivePostSlider";
import { useNavigate } from "react-router";
import { useArchiveCalendar } from "./hooks/useArchive";
import { getApiErrorMessage } from "@/shared/utils/error";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

interface ArchiveProps {
  userId?: string;
}

const Archive = ({ userId }: ArchiveProps) => {
  const navigate = useNavigate();
  const [visibleDate, setVisibleDate] = useState(dayjs());

  const year = visibleDate.year();
  const month = visibleDate.month() + 1;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const {
    data: calendarData,
    error,
    isError,
    isLoading,
  } = useArchiveCalendar({ year, month, userId });

  const shouldLockCalendar = isError;
  const lockMessage = getApiErrorMessage(error);

  const cells = useMemo(() => {
    const startOfMonth = visibleDate.startOf("month");
    const endOfMonth = visibleDate.endOf("month");

    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const result: Array<{ date: dayjs.Dayjs | null }> = [];

    for (let i = 0; i < startDay; i++) {
      result.push({ date: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ date: visibleDate.date(day) });
    }

    while (result.length % 7 !== 0) {
      result.push({ date: null });
    }

    return result;
  }, [visibleDate]);

  const getDayData = (date: dayjs.Dayjs | null) => {
    if (!date) return undefined;
    if (!calendarData) return undefined;
    return calendarData.calendar.find((item) => item.date === date.format("YYYY-MM-DD"));
  };

  const handleDayClick = (date: dayjs.Dayjs | null) => {
    if (shouldLockCalendar || isLoading) return;
    if (!date) return;

    const formattedDate = date.format("YYYY-MM-DD");
    const dayData = getDayData(date);

    if (!dayData?.hasPost) return;

    const postIds = dayData.markers.map((marker) => marker.postId);
    setSelectedDate(formattedDate);
    setSelectedPostIds(postIds);
    setIsSliderOpen(true);
  };

  const handleCloseSlider = () => {
    setIsSliderOpen(false);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Wrapper>
      <Header>
        <ArrowButton onClick={() => setVisibleDate((prev) => prev.subtract(1, "month"))}>
          ‹
        </ArrowButton>
        <MonthTitle>{visibleDate.format("YYYY.MM")}</MonthTitle>
        <ArrowButton onClick={() => setVisibleDate((prev) => prev.add(1, "month"))}>›</ArrowButton>
      </Header>

      <WeekRow>
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </WeekRow>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CalendarBody>
          <Grid $locked={shouldLockCalendar || isLoading}>
            {cells.map((cell, idx) => {
              const dayData = getDayData(cell.date);

              return (
                <DayCell
                  key={idx}
                  cell={cell}
                  dayData={dayData}
                  onClick={() => handleDayClick(cell.date)}
                />
              );
            })}
          </Grid>

          {shouldLockCalendar && !isLoading && (
            <Overlay>
              <OverlayCard>
                <OverlayTitle>캘린더를 볼 수 없어요</OverlayTitle>
                <OverlayText>{lockMessage}</OverlayText>
              </OverlayCard>
            </Overlay>
          )}
        </CalendarBody>
      )}

      {isSliderOpen && !shouldLockCalendar && (
        <ArchivePostSlider
          selectedDate={selectedDate}
          postIds={selectedPostIds}
          onClose={handleCloseSlider}
          onPostClick={handlePostClick}
        />
      )}
    </Wrapper>
  );
};

export default Archive;

const Wrapper = styled.main`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  gap: 10px;
`;

const ArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.icon};
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  display: flex;
  justify-content: center;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.sub};
  }

  &:active {
    transform: scale(0.96);
  }
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text_primary};
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: ${({ theme }) => theme.space.md};
  text-align: center;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const CalendarBody = styled.div`
  position: relative;
`;

const Grid = styled.div<{ $locked?: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.space.md};
  filter: ${({ $locked }) => ($locked ? "grayscale(0.2) blur(1.5px)" : "none")};
  opacity: ${({ $locked }) => ($locked ? 0.45 : 1)};
  pointer-events: ${({ $locked }) => ($locked ? "none" : "auto")};
  transition:
    filter 0.2s ease,
    opacity 0.2s ease;

  @media (max-width: 640px) {
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 250, 252, 0.58);
  border-radius: 20px;
`;

const OverlayCard = styled.div`
  width: min(320px, calc(100% - 32px));
  padding: 20px 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

const OverlayTitle = styled.h3`
  margin: 0 0 8px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text_primary};
`;

const OverlayText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text_secondary};
`;
