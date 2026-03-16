import styled from "styled-components";
import PostForm from "../../features/PostForm/PostForm";
import type { Post } from "../../shared/types/post.type";
import CommentItem from "./components/CommentItem";

const mockPost: Post = {
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
};

const PostDetailPage = () => {
  return (
    <Container>
      <PostForm key={mockPost.post_id} post={mockPost} />
      <CommentList>
        <CommentItem />
      </CommentList>
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

const CommentList = styled.li``;
