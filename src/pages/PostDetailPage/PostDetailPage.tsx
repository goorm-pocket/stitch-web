import styled from "styled-components";
import PostForm from "../../features/PostForm/PostForm";
import type { Comment } from "../../shared/types/comment.type";
import CommentItem from "./components/CommentItem";
import { useParams } from "react-router";
import { useGetPostByIdQuery } from "@/shared/hooks/usePost";

const mockComments: Comment[] = [
  {
    commentId: "9c7a3c1b-4d11-48e3-8e9b-1c4e5f6a7b88",
    author: {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      nickname: "윤구",
      profileImageUrl: "https://i.pravatar.cc/100?img=5",
    },
    content: "오늘 날씨 좋다",
    depth: 1,
    parentId: null,
    rootId: "9c7a3c1b-4d11-48e3-8e9b-1c4e5f6a7b88",
    hasChild: true,
    status: "ACTIVE",
    mentions: [
      {
        userId: "7f90f8c0-2d44-4c7b-a7e6-9b02c0c84c41",
        isSystemGenerated: false,
        startIndex: 0,
        endIndex: 3,
      },
    ],
    createdAt: "2026-01-13T11:20:30Z",
    updatedAt: "2026-01-13T11:20:30Z",
  },
  {
    commentId: "b4a1f9c8-0a23-41a4-bd9c-2e8d5b9d3a77",
    author: {
      userId: "7f90f8c0-2d44-4c7b-a7e6-9b02c0c84c41",
      nickname: "민지",
      profileImageUrl: "https://i.pravatar.cc/100?img=12",
    },
    content: "그러게!",
    depth: 2,
    parentId: "9c7a3c1b-4d11-48e3-8e9b-1c4e5f6a7b88",
    rootId: "9c7a3c1b-4d11-48e3-8e9b-1c4e5f6a7b88",
    hasChild: false,
    status: "ACTIVE",
    mentions: [],
    createdAt: "2026-01-13T11:22:10Z",
    updatedAt: "2026-01-13T11:22:10Z",
  },
];

const PostDetailPage = () => {
  const { id } = useParams();
  const { data: post } = useGetPostByIdQuery({ postId: id! });

  return (
    <Container>
      <ContentSection>
        <PostCard>{post && <PostForm post={post} />}</PostCard>

        <CommentSection>
          <CommentHeader>
            <CommentTitle>Comments</CommentTitle>
            <CommentCount>{mockComments.length}</CommentCount>
          </CommentHeader>

          <CommentInputBox>
            <MyAvatar src="https://i.pravatar.cc/100?img=33" alt="my profile" />
            <CommentInputPlaceholder placeholder="Write a comment..." />
            <CommentSubmitButton type="button">Post</CommentSubmitButton>
          </CommentInputBox>

          <CommentList>
            {mockComments.map((comment) => (
              <CommentItem key={comment.commentId} comment={comment} />
            ))}
          </CommentList>
        </CommentSection>
      </ContentSection>
    </Container>
  );
};

export default PostDetailPage;

const Container = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 24px 56px;
  background: ${({ theme }) => theme.colors.background};
`;

const ContentSection = styled.div`
  width: min(900px, 100%);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PostCard = styled.section`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CommentSection = styled.section`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const CommentCount = styled.span`
  min-width: 28px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.hover};
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const CommentInputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.background};
  padding: 12px 14px;
`;

const MyAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const CommentInputPlaceholder = styled.input`
  flex: 1;
  min-height: 42px;
  border-radius: 12px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 14px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text_disable};
  font-size: 15px;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const CommentSubmitButton = styled.button`
  border: none;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  height: 42px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    opacity: 0.92;
  }
`;

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
