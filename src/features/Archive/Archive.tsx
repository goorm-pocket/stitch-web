import { useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import DayCell from "./components/DayCell";
import type { Calendar } from "../../shared/types/post.type";

interface CalendarDayData {
  userId: string;
  year: number;
  month: number;
  calendar: Calendar[];
}

const mockCalendar: CalendarDayData = {
  userId: "7f90f8c0-2d44-4c7b-a7e6-9b02c0c84c41",
  year: 2026,
  month: 3,
  calendar: [
    {
      date: "2026-03-02",
      hasPost: true,
      postCount: 1,
      isAllPrivate: false,
      hasMultiplePosts: false,
      markers: [
        {
          postId: "1c1e9d3a-1111-4b3b-9a81-3b9a5c3e8a11",
          markerType: "EMOJI",
          markerEmoji: "🌱",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 0,
        },
      ],
    },
    {
      date: "2026-03-05",
      hasPost: true,
      postCount: 2,
      isAllPrivate: false,
      hasMultiplePosts: true,
      markers: [
        {
          postId: "2d2e9d3a-2222-4b3b-9a81-3b9a5c3e8a22",
          markerType: "EMOJI",
          markerEmoji: "🍑",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 0,
        },
        {
          postId: "3e3e9d3a-3333-4b3b-9a81-3b9a5c3e8a33",
          markerType: "IMAGE",
          markerEmoji: null,
          markerImageUrl: "https://cdn.example.com/markers/sample1.png",
          visibility: "FRIENDS",
          order: 1,
        },
      ],
    },
    {
      date: "2026-03-10",
      hasPost: true,
      postCount: 4,
      isAllPrivate: false,
      hasMultiplePosts: true,
      markers: [
        {
          postId: "4f4e9d3a-4444-4b3b-9a81-3b9a5c3e8a44",
          markerType: "EMOJI",
          markerEmoji: "🫧",
          markerImageUrl: null,
          visibility: "PRIVATE",
          order: 0,
        },
        {
          postId: "5g5e9d3a-5555-4b3b-9a81-3b9a5c3e8a55",
          markerType: "EMOJI",
          markerEmoji: "☁️",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 1,
        },
        {
          postId: "6h6e9d3a-6666-4b3b-9a81-3b9a5c3e8a66",
          markerType: "IMAGE",
          markerEmoji: null,
          markerImageUrl: "https://cdn.example.com/markers/sample2.png",
          visibility: "FRIENDS",
          order: 2,
        },
        {
          postId: "7i7e9d3a-7777-4b3b-9a81-3b9a5c3e8a77",
          markerType: "EMOJI",
          markerEmoji: "🍀",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 3,
        },
      ],
    },
    {
      date: "2026-03-15",
      hasPost: true,
      postCount: 1,
      isAllPrivate: true,
      hasMultiplePosts: false,
      markers: [
        {
          postId: "8j8e9d3a-8888-4b3b-9a81-3b9a5c3e8a88",
          markerType: "EMOJI",
          markerEmoji: "🔒",
          markerImageUrl: null,
          visibility: "PRIVATE",
          order: 0,
        },
      ],
    },
    {
      date: "2026-03-21",
      hasPost: true,
      postCount: 2,
      isAllPrivate: false,
      hasMultiplePosts: true,
      markers: [
        {
          postId: "9k9e9d3a-9999-4b3b-9a81-3b9a5c3e8a99",
          markerType: "EMOJI",
          markerEmoji: "🌸",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 0,
        },
        {
          postId: "10l9d3a-aaaa-4b3b-9a81-3b9a5c3e8aaa",
          markerType: "IMAGE",
          markerEmoji: null,
          markerImageUrl: "https://cdn.example.com/markers/sample3.png",
          visibility: "FRIENDS",
          order: 1,
        },
      ],
    },
    {
      date: "2026-03-24",
      hasPost: true,
      postCount: 1,
      isAllPrivate: false,
      hasMultiplePosts: false,
      markers: [
        {
          postId: "11m9d3a-bbbb-4b3b-9a81-3b9a5c3e8bbb",
          markerType: "EMOJI",
          markerEmoji: "🍑",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 0,
        },
      ],
    },
    {
      date: "2026-03-29",
      hasPost: true,
      postCount: 5,
      isAllPrivate: false,
      hasMultiplePosts: true,
      markers: [
        {
          postId: "14p9d3a-eeee-4b3b-9a81-3b9a5c3e8eee",
          markerType: "IMAGE",
          markerEmoji: null,
          markerImageUrl: "https://cdn.example.com/markers/sample4.png",
          visibility: "FRIENDS",
          order: 0,
        },
        {
          postId: "12n9d3a-cccc-4b3b-9a81-3b9a5c3e8ccc",
          markerType: "EMOJI",
          markerEmoji: "🔥",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 1,
        },
        {
          postId: "13o9d3a-dddd-4b3b-9a81-3b9a5c3e8ddd",
          markerType: "EMOJI",
          markerEmoji: "💧",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 2,
        },

        {
          postId: "15q9d3a-ffff-4b3b-9a81-3b9a5c3e8fff",
          markerType: "EMOJI",
          markerEmoji: "🌙",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 3,
        },
        {
          postId: "16r9d3a-gggg-4b3b-9a81-3b9a5c3e8ggg",
          markerType: "EMOJI",
          markerEmoji: "⭐",
          markerImageUrl: null,
          visibility: "FRIENDS",
          order: 4,
        },
      ],
    },
  ],
};

const Archive = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs("2026-03-11"));

  const cells = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const result: Array<{ date: dayjs.Dayjs | null }> = [];

    for (let i = 0; i < startDay; i++) {
      result.push({ date: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ date: currentMonth.date(day) });
    }

    while (result.length % 7 !== 0) {
      result.push({ date: null });
    }

    return result;
  }, [currentMonth]);

  const getDayData = (date: dayjs.Dayjs | null) => {
    if (!date) return undefined;
    return mockCalendar?.calendar.find((item) => item.date === date.format("YYYY-MM-DD"));
  };

  return (
    <Wrapper>
      <Header>
        <NavButton onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}>
          {"<"}
        </NavButton>
        <MonthTitle>{currentMonth.format("YYYY.MM")}</MonthTitle>
        <NavButton onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}>{">"}</NavButton>
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
          return <DayCell key={idx} cell={cell} dayData={dayData} />;
        })}
      </Grid>
    </Wrapper>
  );
};

export default Archive;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const MonthTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.sub};
  color: ${({ theme }) => theme.colors.text_primary};
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;

  span {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text_secondary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;
