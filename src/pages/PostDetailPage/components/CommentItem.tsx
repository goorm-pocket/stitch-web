import { useMemo, useState } from "react";
import styled from "styled-components";
import type { Comment } from "../../../shared/types/comment.type";
import { useGetReplyCommentsQuery } from "@/shared/hooks/useComment";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, name: string) => void;
}

const formatCommentTime = (dateString: string) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const CommentItem = ({ comment, onReply }: CommentItemProps) => {
  const isReply = comment.depth > 1;
  const [showReplies, setShowReplies] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetReplyCommentsQuery({
      commentId: comment.commentId,
    });

  const replies = useMemo(() => {
    return data?.pages.flatMap((page) => page.comments) ?? [];
  }, [data]);

  const handleToggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <Container $isReply={isReply}>
      <Avatar
        src={comment.author.profileImageUrl || "https://i.pravatar.cc/100?img=1"}
        alt={comment.author.nickname}
      />

      <Body>
        <TopRow>
          <UserMeta>
            <Nickname>{comment.author.nickname}</Nickname>
            <Dot>•</Dot>
            <DateText>{formatCommentTime(comment.createdAt)}</DateText>
          </UserMeta>

          <ActionRow>
            <ReplyButton
              type="button"
              onClick={() => onReply(comment.commentId, comment.author.nickname)}
            >
              Reply
            </ReplyButton>

            {comment.hasChild && (
              <ReplyButton type="button" onClick={handleToggleReplies}>
                {showReplies ? "Hide replies" : "View replies"}
              </ReplyButton>
            )}
          </ActionRow>
        </TopRow>

        <Content>
          {comment?.mentionNickname && <ReplyMention>@{comment.mentionNickname}</ReplyMention>}{" "}
          {comment.content}
        </Content>

        {showReplies && comment.hasChild && (
          <ReplySection>
            {isLoading ? (
              <ReplyInfoText>Loading...</ReplyInfoText>
            ) : (
              <>
                <ReplyList>
                  {replies.map((reply) => (
                    <CommentItem key={reply.commentId} comment={reply} onReply={onReply} />
                  ))}
                </ReplyList>

                {hasNextPage && (
                  <MoreButton
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "More replies"}
                  </MoreButton>
                )}
              </>
            )}
          </ReplySection>
        )}
      </Body>
    </Container>
  );
};

export default CommentItem;

const Container = styled.li<{ $isReply: boolean }>`
  display: flex;
  gap: 14px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
`;

const Nickname = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.text_disable};
  font-size: 12px;
`;

const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const ReplyButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text_secondary};
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const Content = styled.p`
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text_primary};
  word-break: break-word;
`;

const ReplyMention = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ReplySection = styled.div`
  margin-top: 8px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReplyList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ReplyInfoText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const MoreButton = styled.button`
  align-self: flex-start;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
    text-decoration: none;
  }
`;
