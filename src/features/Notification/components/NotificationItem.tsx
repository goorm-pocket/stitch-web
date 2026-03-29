import styled from "styled-components";
import type { Notification } from "@/shared/types/notification.type";

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const target = new Date(dateString);
  const diffMs = now.getTime() - target.getTime();

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    return `${minutes}분 전`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours}시간 전`;
  }

  if (diffMs < day * 7) {
    const days = Math.floor(diffMs / day);
    return `${days}일 전`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(target);
};

const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const isUnread = !notification.readAt;

  return (
    <Container type="button" $isUnread={isUnread} onClick={() => onClick?.(notification)}>
      <Content>
        <TopRow>
          <Title>{notification.title}</Title>
          <TimeText>{formatRelativeTime(notification.createdAt)}</TimeText>
        </TopRow>

        <Description>{notification.content}</Description>
      </Content>

      {isUnread && <UnreadDot />}
    </Container>
  );
};

export default NotificationItem;

const Container = styled.button<{ $isUnread: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.md};
  padding: 14px ${({ theme }) => theme.space.lg};
  border: none;
  background: ${({ theme, $isUnread }) => ($isUnread ? theme.colors.background : theme.colors.surface)};
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const TimeText = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text_disable};
`;

const Description = styled.p`
  margin: 6px 0 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  position: absolute;
  top: 18px;
  right: 12px;
`;
