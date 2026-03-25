import styled from "styled-components";
import PostForm from "../../features/PostForm/PostForm";
import CommentItem from "./components/CommentItem";
import { useParams } from "react-router";
import { useGetPostByIdQuery } from "@/shared/hooks/usePost";
import { useCreateCommentMutation, useGetCommentsQuery } from "@/shared/hooks/useComment";
import { useState } from "react";

const PostDetailPage = () => {
  const { id } = useParams();

  // query
  const { data: post } = useGetPostByIdQuery({ postId: id! });
  const { data: commentsPages } = useGetCommentsQuery({ postId: id! });

  // mutate
  const { mutateAsync: createCommnet } = useCreateCommentMutation({
    postId: post?.postId as string,
  });

  // state
  const [commentInput, setCommentInput] = useState<string>("");
  const [replyTargetId, setReplyTargetId] = useState<string>("");
  const [replyTargetName, setReplyTargetName] = useState<string>("");

  const comments = commentsPages?.pages.flatMap((page) => page.comments) ?? [];

  // handle function
  const handleCreateComment = async () => {
    if (!commentInput.trim()) return;
    if (!post) return;
    await createCommnet({ postId: post?.postId, content: commentInput, parentId: replyTargetId });
    setCommentInput("");
    setReplyTargetId("");
    setReplyTargetName("");
  };

  const handleReply = (commentId: string, name: string) => {
    setReplyTargetId(commentId);
    setReplyTargetName(name);
  };

  const handleRemoveReply = () => {
    setReplyTargetId("");
    setReplyTargetName("");
  };

  return (
    <Container>
      <ContentSection>
        <PostCard>{post && <PostForm post={post} mode="detail" />}</PostCard>

        <CommentSection>
          <CommentHeader>
            <CommentTitle>Comments</CommentTitle>
          </CommentHeader>

          <CommentInputBox>
            {replyTargetId && (
              <ReplyTargetIdBox>
                <ReplyMention>@{replyTargetName}</ReplyMention>
                <ReplyRemoveButton type="button" onClick={handleRemoveReply}>
                  ×
                </ReplyRemoveButton>
              </ReplyTargetIdBox>
            )}

            <CommentEditorRow>
              <CommentTextarea
                value={commentInput}
                placeholder={replyTargetId ? "Write a reply..." : "Write a comment..."}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <CommentSubmitButton type="button" onClick={handleCreateComment}>
                Create
              </CommentSubmitButton>
            </CommentEditorRow>
          </CommentInputBox>

          <CommentList>
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onReply={() => handleReply(comment.commentId, comment.author.nickname)}
              />
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

const CommentInputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  background: white;
`;

const ReplyTargetIdBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.hover};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReplyMention = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ReplyRemoveButton = styled.button`
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const CommentEditorRow = styled.div`
  display: flex;
  gap: 12px;
`;

const CommentTextarea = styled.textarea`
  flex: 1;
  min-height: 88px;
  padding: 14px 16px;
  border-radius: 16px;
  resize: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text_primary};
  font-size: 15px;
  line-height: 1.5;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text_secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: white;
  }
`;

const CommentSubmitButton = styled.button`
  border: none;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 700;
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
