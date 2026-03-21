import styled from "styled-components";
import type { Post } from "../../shared/types/post.type";
import PostForm from "../PostForm/PostForm";

const mockdata: Post = {
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

interface PostModalProps {
  userId: string;
  postId: string;
  onClose: () => void;
}

const PostModal = ({ onClose, postId }: PostModalProps) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>
          <PostForm post={mockdata} />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default PostModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  background: rgba(71, 85, 105, 0.35);
  backdrop-filter: blur(6px);
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;

  border-radius: 24px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: end;

  padding: 18px 20px;

  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  border-radius: 24px 24px 0 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;

  border: none;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.hover};
  color: ${({ theme }) => theme.colors.icon};

  font-size: 22px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.sub};
  }
`;

const Content = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text_primary};
`;
