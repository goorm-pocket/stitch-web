import styled from "styled-components";
import type { Comment } from "../../../shared/types/comment.type";

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
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
            <ReplyButton type="button" onClick={onReply}>
              Reply
            </ReplyButton>
          </ActionRow>
        </TopRow>

        <Content>{comment.content}</Content>
      </Body>
    </Container>
  );
};

export default CommentItem;

const Container = styled.li<{ $isReply: boolean }>`
  display: flex;
  gap: 14px;
  padding: 16px;
  margin-left: ${({ $isReply }) => ($isReply ? "36px" : "0")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  background: "white";
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
