import styled from "styled-components";
import PostForm from "../PostForm/PostForm";
import { useGetPostByIdQuery } from "@/shared/hooks/usePost";

interface PostModalProps {
  userId: string;
  postId: string;
  onClose: () => void;
}

const PostModal = ({ onClose, postId }: PostModalProps) => {
  const { data: post } = useGetPostByIdQuery({ postId });

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>{post && <PostForm post={post} />}</Content>
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
