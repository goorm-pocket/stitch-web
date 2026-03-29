import styled from "styled-components";
import type { Comment } from "../../../shared/types/comment.type";

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

const ReCommentItem = ({ comment, onReply }: CommentItemProps) => {
  return (
    <Container>
      <Avatar
        src={comment.author.profileImageUrl || "https://i.pravatar.cc/100?img=1"}
        alt={comment.author.nickname}
      />

      <Body>
        <TopRow>
          <UserMeta>
            <Nickname>{comment.author.nickname}</Nickname>
          </UserMeta>

          <ActionRow>
            <ReplyButton
              type="button"
              onClick={() => onReply(comment.commentId, comment.author.nickname)}
            >
              Reply
            </ReplyButton>
          </ActionRow>
        </TopRow>

        <Content>
          {comment.mentionNickname && <ReplyMention>@{comment.mentionNickname}</ReplyMention>}{" "}
          {comment.content}
        </Content>

        <MetaRow>
          <DateText>{formatCommentTime(comment.createdAt)}</DateText>
        </MetaRow>
      </Body>
    </Container>
  );
};

export default ReCommentItem;

const Container = styled.li`
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.round};
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
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
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
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
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_primary};
  word-break: break-word;
`;

const ReplyMention = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
`;

const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;
