import styled from "styled-components";
import PostForm from "../../features/PostForm/PostForm";
import CommentItem from "./components/CommentItem";
import { useParams } from "react-router";
import { useGetPostByIdQuery } from "@/shared/hooks/usePost";
import { useGetCommentsQuery } from "@/shared/hooks/useComment";

const PostDetailPage = () => {
  const { id } = useParams();
  const { data: post } = useGetPostByIdQuery({ postId: id! });
  const { data: commentsPages } = useGetCommentsQuery({ postId: id! });
  const comments = commentsPages?.pages.flatMap((page) => page.comments) ?? [];
  console.log(comments);
  return (
    <Container>
      <ContentSection>
        <PostCard>{post && <PostForm post={post} />}</PostCard>

        <CommentSection>
          <CommentHeader>
            <CommentTitle>Comments</CommentTitle>
            <CommentCount>{comments.length}</CommentCount>
          </CommentHeader>

          <CommentInputBox>
            <CommentInputPlaceholder placeholder="Write a comment..." />
            <CommentSubmitButton type="button">Post</CommentSubmitButton>
          </CommentInputBox>

          <CommentList>
            {comments.map((comment) => (
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
