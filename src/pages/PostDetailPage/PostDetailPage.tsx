import styled from "styled-components";
import PostForm from "../../features/Post/PostForm";
import type { Post } from "../../shared/types/post.type";

const mockPosts: Post[] = [
  {
    post_id: "post-1",

    author: {
      user_id: "user-1",
      nickname: "Sarah",
      profile_image_url: "https://i.pravatar.cc/150?img=32",
    },

    content:
      "Finally made it to the mountains this weekend. There's something about the crisp morning air and the mirror-like reflections on the water that just resets your entire soul.",

    visibility: "PUBLIC",

    like_count: 12,
    liked_by_me: true,

    created_at: "2026-03-15T07:00:00Z",
    updated_at: "2026-03-15T07:00:00Z",

    editable_until: "2026-03-15T08:00:00Z",
    is_editable: true,

    marker_type: "EMOJI",
    marker_emoji: "🏔️",
    marker_image_url: null,

    images: [
      {
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      },
    ],
  },

  {
    post_id: "post-2",

    author: {
      user_id: "user-2",
      nickname: "Taylor",
      profile_image_url: "https://i.pravatar.cc/150?img=12",
    },

    content:
      "Spent the morning by the lake with coffee and a good book. Sometimes slowing down is exactly what we need.",

    visibility: "PUBLIC",

    like_count: 5,
    liked_by_me: false,

    created_at: "2026-03-14T10:00:00Z",
    updated_at: "2026-03-14T10:00:00Z",

    editable_until: "2026-03-14T11:00:00Z",
    is_editable: false,

    marker_type: "IMAGE",
    marker_emoji: null,
    marker_image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba",

    images: [
      {
        // image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
    ],
  },

  {
    post_id: "post-3",

    author: {
      user_id: "user-3",
      nickname: "Daniel",
      profile_image_url: "https://i.pravatar.cc/150?img=15",
    },

    content:
      "Hiking through the forest today. The air smells different when you're surrounded by trees.",

    visibility: "FRIENDS",

    like_count: 20,
    liked_by_me: true,

    created_at: "2026-03-13T09:00:00Z",
    updated_at: "2026-03-13T09:00:00Z",

    editable_until: "2026-03-13T10:00:00Z",
    is_editable: false,

    marker_type: "EMOJI",
    marker_emoji: "🌲",
    marker_image_url: null,

    images: [
      {
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      },
    ],
  },
];

const PostDetailPage = () => {
  return (
    <Container>
      {mockPosts && mockPosts.map((post) => <PostForm key={post.post_id} post={post} />)}
    </Container>
  );
};

export default PostDetailPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 900px;
  padding: 12px 28px;
  gap: 24px;
`;
