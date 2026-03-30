import styled from "styled-components";
import PostForm from "../../features/PostForm/PostForm";
import CommentItem from "./components/CommentItem";
import { useParams } from "react-router";
import { useGetPostByIdQuery } from "@/shared/hooks/usePost";
import { useCreateCommentMutation, useGetCommentsQuery } from "@/shared/hooks/useComment";
import { useRef, useState } from "react";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

const PostDetailPage = () => {
  const { id } = useParams();
  // ref
  const commentListRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // state
  const [commentInput, setCommentInput] = useState<string>("");
  const [replyTargetId, setReplyTargetId] = useState<string>("");
  const [replyTargetName, setReplyTargetName] = useState<string>("");

  // query
  const { data: post, isLoading: isPostLoading } = useGetPostByIdQuery({ postId: id! });
  const {
    data: commentsPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
  } = useGetCommentsQuery({ postId: id! });

  // mutate
  const { mutateAsync: createCommnet } = useCreateCommentMutation({
    postId: post?.postId as string,
  });

  const comments = commentsPages?.pages.flatMap((page) => page.comments) ?? [];

  // 커스텀 훅
  useInfiniteScroll({
    enabled: true,
    hasNextPage,
    isFetchingNextPage,
    // rootRef: commentListRef,
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
  });

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
        {isPostLoading && (
          <PostLoadingContainer>
            <LoadingSpinner size="lg" message="게시글을 불러오는 중..." />
          </PostLoadingContainer>
        )}
        {!isPostLoading && <PostCard>{post && <PostForm post={post} mode="detail" />}</PostCard>}

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

          <CommentList ref={commentListRef}>
            {isCommentsLoading ? (
              <InlineSpinnerContainer>
                <LoadingSpinner size="md" message="댓글을 불러오는 중..." />
              </InlineSpinnerContainer>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.commentId} comment={comment} onReply={handleReply} />
              ))
            )}
            <LoadMoreTrigger ref={loadMoreRef} />

            {isFetchingNextPage && (
              <InlineSpinnerContainer>
                <LoadingSpinner size="sm" message="댓글 더 불러오는 중..." />
              </InlineSpinnerContainer>
            )}
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
  padding: clamp(20px, 4vw, 32px) 0 56px;
  background: ${({ theme }) => theme.colors.background};
`;

const ContentSection = styled.div`
  width: min(900px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxl};
`;

const PostCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xxl};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  overflow: hidden;
`;

const PostLoadingContainer = styled(PostCard)`
  min-height: 320px;
`;

const CommentSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xxl};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  padding: clamp(18px, 3vw, 24px);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const CommentInputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
`;

const ReplyTargetIdBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.hover};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReplyMention = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ReplyRemoveButton = styled.button`
  width: 18px;
  height: 18px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: 12px;
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
  gap: ${({ theme }) => theme.space.md};

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const CommentTextarea = styled.textarea`
  flex: 1;
  min-height: 88px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  resize: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.text_primary};
  font-size: 14px;
  line-height: 1.45;

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
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0 18px;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  @media (max-width: 640px) {
    min-height: 44px;
  }

  &:hover {
    opacity: 0.92;
  }
`;

const CommentList = styled.div`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`;

const InlineSpinnerContainer = styled.div`
  width: 100%;
  min-height: 72px;
`;
