import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import NotificationIcon from "@/assets/settings/notification-icon.svg";
import NotificationItem from "./components/NotificationItem";
import {
  useGetNotificationsInfiniteQuery,
  useReadNotificationMutation,
} from "@/shared/hooks/useNotification";
import type { Notification } from "@/shared/types/notification.type";
import { useNotificationSSE } from "./hooks/useNotificationSSE";
import { getNotificationRedirectUrl } from "./utils/redirectNotification";
import { useNavigate } from "react-router";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  // ref
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // state
  const [isOpen, setIsOpen] = useState(false);

  // data
  const { data: notificationsPages, hasNextPage } = useGetNotificationsInfiniteQuery();

  // mutate
  const { mutateAsync: readNotification } = useReadNotificationMutation();

  // 커스텀 훅
  // 밖 클릭했을 때 닫는 훅
  useClickOutside({
    ref: wrapperRef,
    onClickOutside: () => setIsOpen(false),
  });

  // 서버에서 받은 기존 알림
  const serverNotifications = useMemo(() => {
    return notificationsPages?.pages.flatMap((page) => page.items) ?? [];
  }, [notificationsPages]);

  const { liveNotifications } = useNotificationSSE();

  // 서버 알림 + SSE 알림 합치기 (중복 제거)
  const notifications = useMemo(() => {
    const merged = [...liveNotifications, ...serverNotifications];
    const map = new Map<string, Notification>();

    merged.forEach((item) => {
      map.set(item.notificationId, item);
    });

    return Array.from(map.values());
  }, [liveNotifications, serverNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.readAt).length;
  }, [notifications]);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickNotification = async (clickedNotnotificationIdification: Notification) => {
    await readNotification(clickedNotnotificationIdification.notificationId);
    navigate(getNotificationRedirectUrl(clickedNotnotificationIdification));
    setIsOpen(false);
  };

  const handleReadAll = () => {};

  return (
    <Wrapper ref={wrapperRef}>
      <IconButton type="button" onClick={handleToggleDropdown} aria-label="알림 열기">
        <StyledNotificationIcon />
        {unreadCount > 0 && <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>}
      </IconButton>

      {isOpen && (
        <Dropdown>
          <Header>
            <HeaderTitle>알림</HeaderTitle>
            {notifications.length > 0 && (
              <ReadAllButton type="button" onClick={handleReadAll}>
                모두 읽음
              </ReadAllButton>
            )}
          </Header>

          <List>
            {notifications.length === 0 ? (
              <EmptyState>새로운 알림이 없어요.</EmptyState>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.notificationId}
                  notification={notification}
                  onClick={handleClickNotification}
                />
              ))
            )}
          </List>

          {hasNextPage && <FooterText>더 많은 알림이 있어요</FooterText>}
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default NotificationDropdown;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.border3};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const StyledNotificationIcon = styled(NotificationIcon)`
  width: 20px;
  height: 20px;

  path {
    fill: ${({ theme }) => theme.colors.icon};
  }
`;

const Badge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  position: absolute;
  top: -4px;
  right: -2px;
  box-shadow: 0 0 0 2px #fff;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 360px;
  max-height: 460px;
  overflow: hidden;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
  z-index: 1000;
`;

const Header = styled.div`
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const ReadAllButton = styled.button`
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    opacity: 0.8;
  }
`;

const List = styled.div`
  max-height: 348px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 48px 16px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const FooterText = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text_disable};
`;
