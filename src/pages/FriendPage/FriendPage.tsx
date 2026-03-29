import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import FriendItem from "./components/FriendItem";
import { useRef, useState } from "react";
import {
  useGetFriendsQuery,
  useGetReceivedRequestsQuery,
  useGetSentRequestsQuery,
  useSendFriendRequestMutation,
} from "@/shared/hooks/useFriend";
import SearchUserItem from "./components/SearchUserItem";
import { useGetProfileByNameQuery } from "@/shared/hooks/useUser";
import type { Friend } from "@/shared/types/friend.type";
import { useNavigate } from "react-router";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

const FriendPage = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLDivElement | null>(null);

  // state
  const [showSearchList, setShowSearchList] = useState<boolean>(false);
  const [selectList, setSelectList] = useState<"friend" | "sent" | "received">("friend");
  const [searchName, setSearchName] = useState<string>("");

  // query
  const { data: searchUserListRes } = useGetProfileByNameQuery({ query: searchName });

  const { data: friendsPages } = useGetFriendsQuery();
  const { data: sentRequestsRes } = useGetSentRequestsQuery();
  const { data: receivedRequestsRes } = useGetReceivedRequestsQuery();

  // mutate
  const { mutate: sendFriendRequest } = useSendFriendRequestMutation();

  // 커스텀 훅
  // 밖에 클릭하면 친구 요청 리스트 닫는거
  useClickOutside({
    ref: searchInputRef,
    onClickOutside: () => setShowSearchList(false),
    enabled: showSearchList,
  });

  const searchUserList = searchUserListRes?.pages[0].items ?? [];

  // 리스트 추출
  const friends = friendsPages?.items ?? [];
  const sentRequests = sentRequestsRes?.items ?? [];
  const receivedRequests = receivedRequestsRes?.items ?? [];

  const handleAddFriend = (id: string) => {
    sendFriendRequest({ userId: id });
    setSearchName("");
  };

  return (
    <Container>
      <TitleContainer>
        <Title>Friend</Title>
        <Description>Manage your friend community</Description>
      </TitleContainer>
      <RequestInputContainer>
        <RequestText>Search and Add Friends</RequestText>
        <FriendSearchSection ref={searchInputRef}>
          <SearchInput
            placeholder="Enter username..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onFocus={() => setShowSearchList(true)}
          />

          {showSearchList && (
            <SearchUserList>
              {searchUserList?.length > 0 ? (
                searchUserList?.map((item) => (
                  <SearchUserItem
                    key={item.userId}
                    user={item}
                    handleAdd={(e) => {
                      e.stopPropagation();
                      handleAddFriend(item.userId);
                    }}
                    handleClick={() => navigate(`/profile/${item.userId}`)}
                  />
                ))
              ) : (
                <EmptyText>No users found.</EmptyText>
              )}
            </SearchUserList>
          )}
        </FriendSearchSection>
      </RequestInputContainer>
      <ButtonContainer>
        <ButtonBox>
          <SelectButton $active={selectList === "friend"} onClick={() => setSelectList("friend")}>
            Friend List
          </SelectButton>
          <SelectButton $active={selectList === "sent"} onClick={() => setSelectList("sent")}>
            Sent Requests
          </SelectButton>
          <SelectButton
            $active={selectList === "received"}
            onClick={() => setSelectList("received")}
          >
            Received Requests
          </SelectButton>
        </ButtonBox>
      </ButtonContainer>

      <FriendListContainer>
        {selectList == "friend" &&
          friends.map((friend) => (
            <FriendItem
              key={friend.friendId}
              friend={friend}
              state="ACCEPTED"
              handleClick={() => navigate(`/profile/${friend.user.userId}`)}
            />
          ))}
        {selectList == "sent" &&
          sentRequests.map((friend: Friend) => (
            <FriendItem
              key={friend.friendId}
              friend={friend}
              state="SENT"
              handleClick={() => navigate(`/profile/${friend.user.userId}`)}
            />
          ))}
        {selectList == "received" &&
          receivedRequests.map((friend: Friend) => (
            <FriendItem
              key={friend.friendId}
              friend={friend}
              state="RECEIVED"
              handleClick={() => navigate(`/profile/${friend.user.userId}`)}
            />
          ))}
      </FriendListContainer>
    </Container>
  );
};

export default FriendPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: min(${({ theme }) => theme.layout.contentWidth}, 100%);
  padding: ${({ theme }) => theme.space.lg} 0 ${({ theme }) => theme.space.xxxl};
  gap: ${({ theme }) => theme.space.xxxl};
`;

const TitleContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.div`
  font-size: clamp(26px, 5vw, 30px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const RequestInputContainer = styled(StitchedBox)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  gap: ${({ theme }) => theme.space.md};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  overflow: visible;
`;

const RequestText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: white;
`;

const FriendSearchSection = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 43px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.xs};
  color: white;
  padding: 0 12px;
  font-size: ${({ theme }) => theme.fontSize.md};

  &::placeholder {
    color: rgba(255, 255, 255, 0.65);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.45);
  }
`;

const SearchUserList = styled.div`
  position: absolute;
  top: calc(100%);
  left: 0;
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
  padding: 8px;
  border-bottom-left-radius: ${({ theme }) => theme.radii.md};
  border-bottom-right-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 20;

  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EmptyText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 72px;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  min-height: 56px;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.sub};
  gap: ${({ theme }) => theme.space.xs};
  padding: 6px;
  border-radius: ${({ theme }) => theme.radii.xs};
  flex-wrap: wrap;
`;

interface SelectButtonProps {
  $active: boolean;
}

const SelectButton = styled.button<SelectButtonProps>`
  border: none;
  height: 44px;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text_secondary)};
  background: ${({ $active }) => ($active ? "white" : "inherit")};
  font-weight: 700;
  padding: 0 10px;
  border-radius: 6px;
  cursor: pointer;
`;

const FriendListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
