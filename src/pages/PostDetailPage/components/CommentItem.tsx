import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import type { Comment } from "../../../shared/types/comment.type";
import { useDeleteCommentMutation, useGetReplyCommentsQuery } from "@/shared/hooks/useComment";
import ReCommentItem from "./ReCommentItem";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

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
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { mutate: deleteComments, isPending: isDeleting } = useDeleteCommentMutation();

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

  const handleDeleteComment = () => {
    deleteComments(
      { commentId: comment.commentId },
      {
        onSuccess: () => {
          setShowMenu(false);
        },
      },
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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
          </UserMeta>

          <ActionRow>
            <ReplyButton
              type="button"
              onClick={() => onReply(comment.commentId, comment.author.nickname)}
            >
              Reply
            </ReplyButton>

            <MenuWrapper ref={menuRef}>
              <MenuButton type="button" onClick={() => setShowMenu((prev) => !prev)}>
                ⋯
              </MenuButton>

              {showMenu && (
                <MenuDropdown>
                  <DeleteButton type="button" onClick={handleDeleteComment} disabled={isDeleting}>
                    {isDeleting ? "삭제 중..." : "삭제"}
                  </DeleteButton>
                </MenuDropdown>
              )}
            </MenuWrapper>
          </ActionRow>
        </TopRow>

        <Content>
          {comment?.mentionNickname && <ReplyMention>@{comment.mentionNickname}</ReplyMention>}{" "}
          {comment.content}
        </Content>

        <MetaRow>
          <DateText>{formatCommentTime(comment.createdAt)}</DateText>

          {comment.hasChild && (
            <ToggleRepliesButton type="button" onClick={handleToggleReplies}>
              <ChevronIcon $open={showReplies} viewBox="0 0 24 24">
                <path d="M7 10L12 15L17 10" />
              </ChevronIcon>
              <span>{showReplies ? "Hide" : "View"}</span>
            </ToggleRepliesButton>
          )}
        </MetaRow>

        {showReplies && comment.hasChild && (
          <ReplySection>
            {isLoading ? (
              <ReplySpinnerContainer>
                <LoadingSpinner size="sm" message="답글을 불러오는 중..." />
              </ReplySpinnerContainer>
            ) : (
              <>
                <ReplyList>
                  {replies.map((reply) => (
                    <ReCommentItem key={reply.commentId} comment={reply} onReply={onReply} />
                  ))}
                </ReplyList>

                {hasNextPage && (
                  <MoreButton
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "불러오는 중..." : "More replies"}
                  </MoreButton>
                )}

                {isFetchingNextPage && (
                  <ReplySpinnerContainer>
                    <LoadingSpinner size="sm" />
                  </ReplySpinnerContainer>
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
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.xs};

  @media (max-width: 640px) {
    gap: ${({ theme }) => theme.space.md};
  }
`;

const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: ${({ theme }) => theme.radii.round};
  object-fit: cover;
  flex-shrink: 0;
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

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
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

const DateText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
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
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text_secondary};
  border-radius: ${({ theme }) => theme.radii.round};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 90px;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 10;
`;

const DeleteButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const Content = styled.p`
  margin: 0;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text_primary};
  word-break: break-word;
`;

const ReplyMention = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ToggleRepliesButton = styled.button`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  padding: 4px 2px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.xs};
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const ChevronIcon = styled.svg<{ $open: boolean }>`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.22s ease;
`;

const ReplySection = styled.div`
  margin-top: 8px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ReplyList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ReplySpinnerContainer = styled.div`
  width: 100%;
  min-height: 56px;
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
