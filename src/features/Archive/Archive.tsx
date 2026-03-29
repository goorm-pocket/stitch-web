import { useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import DayCell from "./components/DayCell";
import ArchivePostSlider from "../../features/ArchivePostSlider/ArchivePostSlider";
import { useNavigate } from "react-router";
import { useArchiveCalendar } from "./hooks/useArchive";

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

  const { data: calendarData } = useArchiveCalendar({ year, month, userId });

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
    if (!date) return;

    const formattedDate = date.format("YYYY-MM-DD");
    const dayData = getDayData(date);

    if (!dayData?.hasPost) return;

    const postIds = dayData.markers.map((marker) => marker.postId);
    console.log(postIds);
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

      <Grid>
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

      {isSliderOpen && (
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
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  display: flex;
  align-items: center;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.space.md};

  @media (max-width: 640px) {
    gap: ${({ theme }) => theme.space.sm};
  }
`;
