import { useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import DayCell from "./components/DayCell";
import ArchivePostSlider from "../../features/ArchivePostSlider/ArchivePostSlider";
import type { Calendar, Post } from "../../shared/types/post.type";
import { useNavigate } from "react-router";

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

const mockPosts: Array<Post & { archiveDate: string }> = [
  {
    archiveDate: "2026-03-02",
    post_id: "1c1e9d3a-1111-4b3b-9a81-3b9a5c3e8a11",
    author: {
      user_id: "user-1",
      nickname: "Sarah",
      profile_image_url: "https://i.pravatar.cc/150?img=32",
    },
    content: "오늘은 작은 새싹처럼 기분이 천천히 올라오는 하루였어.",
    visibility: "FRIENDS",
    like_count: 3,
    liked_by_me: false,
    created_at: "2026-03-02T09:00:00Z",
    updated_at: "2026-03-02T09:00:00Z",
    editable_until: "2026-03-02T10:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "🌱",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-05",
    post_id: "2d2e9d3a-2222-4b3b-9a81-3b9a5c3e8a22",
    author: {
      user_id: "user-2",
      nickname: "Taylor",
      profile_image_url: "https://i.pravatar.cc/150?img=12",
    },
    content: "복숭아 향이 진짜 좋았던 날. 기분 좋은 산책이었다.",
    visibility: "FRIENDS",
    like_count: 8,
    liked_by_me: true,
    created_at: "2026-03-05T07:00:00Z",
    updated_at: "2026-03-05T07:00:00Z",
    editable_until: "2026-03-05T08:00:00Z",
    is_editable: true,
    marker_type: "EMOJI",
    marker_emoji: "🍑",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-05",
    post_id: "3e3e9d3a-3333-4b3b-9a81-3b9a5c3e8a33",
    author: {
      user_id: "user-3",
      nickname: "Daniel",
      profile_image_url: "https://i.pravatar.cc/150?img=15",
    },
    content: "사진으로 남기고 싶을 만큼 예뻤던 순간.",
    visibility: "FRIENDS",
    like_count: 11,
    liked_by_me: false,
    created_at: "2026-03-05T10:00:00Z",
    updated_at: "2026-03-05T10:00:00Z",
    editable_until: "2026-03-05T11:00:00Z",
    is_editable: false,
    marker_type: "IMAGE",
    marker_emoji: null,
    marker_image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      },
    ],
  },
  {
    archiveDate: "2026-03-10",
    post_id: "4f4e9d3a-4444-4b3b-9a81-3b9a5c3e8a44",
    author: {
      user_id: "user-4",
      nickname: "Mina",
      profile_image_url: "https://i.pravatar.cc/150?img=20",
    },
    content: "버블처럼 생각이 떠다니는 날.",
    visibility: "PRIVATE",
    like_count: 2,
    liked_by_me: false,
    created_at: "2026-03-10T06:00:00Z",
    updated_at: "2026-03-10T06:00:00Z",
    editable_until: "2026-03-10T07:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "🫧",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-10",
    post_id: "5g5e9d3a-5555-4b3b-9a81-3b9a5c3e8a55",
    author: {
      user_id: "user-5",
      nickname: "Jin",
      profile_image_url: "https://i.pravatar.cc/150?img=25",
    },
    content: "구름 보면서 멍 때리기 좋은 오후.",
    visibility: "FRIENDS",
    like_count: 6,
    liked_by_me: true,
    created_at: "2026-03-10T08:30:00Z",
    updated_at: "2026-03-10T08:30:00Z",
    editable_until: "2026-03-10T09:30:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "☁️",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-15",
    post_id: "8j8e9d3a-8888-4b3b-9a81-3b9a5c3e8a88",
    author: {
      user_id: "user-6",
      nickname: "Avery",
      profile_image_url: "https://i.pravatar.cc/150?img=28",
    },
    content: "오늘은 나만 볼 수 있는 조용한 기록.",
    visibility: "PRIVATE",
    like_count: 0,
    liked_by_me: false,
    created_at: "2026-03-15T13:00:00Z",
    updated_at: "2026-03-15T13:00:00Z",
    editable_until: "2026-03-15T14:00:00Z",
    is_editable: true,
    marker_type: "EMOJI",
    marker_emoji: "🔒",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-21",
    post_id: "9k9e9d3a-9999-4b3b-9a81-3b9a5c3e8a99",
    author: {
      user_id: "user-7",
      nickname: "Chris",
      profile_image_url: "https://i.pravatar.cc/150?img=31",
    },
    content: "꽃 피는 날씨라 괜히 마음도 가벼웠다.",
    visibility: "FRIENDS",
    like_count: 14,
    liked_by_me: true,
    created_at: "2026-03-21T05:00:00Z",
    updated_at: "2026-03-21T05:00:00Z",
    editable_until: "2026-03-21T06:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "🌸",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-21",
    post_id: "10l9d3a-aaaa-4b3b-9a81-3b9a5c3e8aaa",
    author: {
      user_id: "user-8",
      nickname: "Jamie",
      profile_image_url: "https://i.pravatar.cc/150?img=35",
    },
    content: "사진 한 장으로 남겨두고 싶었던 풍경.",
    visibility: "FRIENDS",
    like_count: 9,
    liked_by_me: false,
    created_at: "2026-03-21T09:10:00Z",
    updated_at: "2026-03-21T09:10:00Z",
    editable_until: "2026-03-21T10:10:00Z",
    is_editable: false,
    marker_type: "IMAGE",
    marker_emoji: null,
    marker_image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      },
    ],
  },
  {
    archiveDate: "2026-03-24",
    post_id: "11m9d3a-bbbb-4b3b-9a81-3b9a5c3e8bbb",
    author: {
      user_id: "user-9",
      nickname: "Luna",
      profile_image_url: "https://i.pravatar.cc/150?img=41",
    },
    content: "복숭아 디저트가 생각났던 하루.",
    visibility: "FRIENDS",
    like_count: 4,
    liked_by_me: false,
    created_at: "2026-03-24T11:00:00Z",
    updated_at: "2026-03-24T11:00:00Z",
    editable_until: "2026-03-24T12:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "🍑",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-29",
    post_id: "14p9d3a-eeee-4b3b-9a81-3b9a5c3e8eee",
    author: {
      user_id: "user-10",
      nickname: "Noah",
      profile_image_url: "https://i.pravatar.cc/150?img=45",
    },
    content: "사진으로 기억하고 싶은 하루의 색감.",
    visibility: "FRIENDS",
    like_count: 16,
    liked_by_me: true,
    created_at: "2026-03-29T04:00:00Z",
    updated_at: "2026-03-29T04:00:00Z",
    editable_until: "2026-03-29T05:00:00Z",
    is_editable: false,
    marker_type: "IMAGE",
    marker_emoji: null,
    marker_image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      },
    ],
  },
  {
    archiveDate: "2026-03-29",
    post_id: "12n9d3a-cccc-4b3b-9a81-3b9a5c3e8ccc",
    author: {
      user_id: "user-11",
      nickname: "Sia",
      profile_image_url: "https://i.pravatar.cc/150?img=50",
    },
    content: "오늘은 에너지가 넘쳤다.",
    visibility: "FRIENDS",
    like_count: 7,
    liked_by_me: false,
    created_at: "2026-03-29T07:00:00Z",
    updated_at: "2026-03-29T07:00:00Z",
    editable_until: "2026-03-29T08:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "🔥",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-29",
    post_id: "13o9d3a-dddd-4b3b-9a81-3b9a5c3e8ddd",
    author: {
      user_id: "user-12",
      nickname: "Ethan",
      profile_image_url: "https://i.pravatar.cc/150?img=56",
    },
    content: "비 온 뒤 공기가 맑아서 좋았다.",
    visibility: "FRIENDS",
    like_count: 5,
    liked_by_me: false,
    created_at: "2026-03-29T09:00:00Z",
    updated_at: "2026-03-29T09:00:00Z",
    editable_until: "2026-03-29T10:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "💧",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-29",
    post_id: "15q9d3a-ffff-4b3b-9a81-3b9a5c3e8fff",
    author: {
      user_id: "user-13",
      nickname: "Milo",
      profile_image_url: "https://i.pravatar.cc/150?img=60",
    },
    content: "달 보면서 하루 마무리.",
    visibility: "FRIENDS",
    like_count: 10,
    liked_by_me: true,
    created_at: "2026-03-29T12:00:00Z",
    updated_at: "2026-03-29T12:00:00Z",
    editable_until: "2026-03-29T13:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "🌙",
    marker_image_url: null,
    images: [],
  },
  {
    archiveDate: "2026-03-29",
    post_id: "16r9d3a-gggg-4b3b-9a81-3b9a5c3e8ggg",
    author: {
      user_id: "user-14",
      nickname: "Chloe",
      profile_image_url: "https://i.pravatar.cc/150?img=63",
    },
    content: "별이 유난히 잘 보이던 밤.",
    visibility: "FRIENDS",
    like_count: 13,
    liked_by_me: false,
    created_at: "2026-03-29T14:00:00Z",
    updated_at: "2026-03-29T14:00:00Z",
    editable_until: "2026-03-29T15:00:00Z",
    is_editable: false,
    marker_type: "EMOJI",
    marker_emoji: "⭐",
    marker_image_url: null,
    images: [],
  },
];

const Archive = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs("2026-03-11"));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

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
    return mockCalendar.calendar.find((item) => item.date === date.format("YYYY-MM-DD"));
  };

  const selectedPosts = useMemo(() => {
    if (!selectedDate) return [];
    return mockPosts.filter((post) => post.archiveDate === selectedDate);
  }, [selectedDate]);

  const handleDayClick = (date: dayjs.Dayjs | null) => {
    if (!date) return;

    const formattedDate = date.format("YYYY-MM-DD");
    const dayData = getDayData(date);

    if (!dayData?.hasPost) return;

    setSelectedDate(formattedDate);
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
        <ArrowButton onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}>
          ‹
        </ArrowButton>
        <MonthTitle>{currentMonth.format("YYYY.MM")}</MonthTitle>
        <ArrowButton onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}>›</ArrowButton>
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

      <ArchivePostSlider
        open={isSliderOpen}
        selectedDate={selectedDate}
        posts={selectedPosts}
        onClose={handleCloseSlider}
        onPostClick={handlePostClick}
      />
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
  margin-bottom: 20px;
  gap: 10px;
`;

const ArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: white;
  color: ${({ theme }) => theme.colors.icon};
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

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
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 12px;
  text-align: center;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
`;
