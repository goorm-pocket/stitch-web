import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import FriendItem from "./components/FriendItem";
import { useEffect, useRef, useState } from "react";
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

  const searchUserList = searchUserListRes?.pages[0].items ?? [];

  // 리스트 추출
  const friends = friendsPages?.items ?? [];
  const sentRequests = sentRequestsRes?.items ?? [];
  const receivedRequests = receivedRequestsRes?.items ?? [];

  const handleAddFriend = (id: string) => {
    sendFriendRequest({ userId: id });
    setSearchName("");
  };

  // 밖에 클릭하면 친구 요청 리스트 닫는거
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSearchList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  width: 900px;
  padding: 16px 32px;
  gap: 32px;
`;

const TitleContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const RequestInputContainer = styled(StitchedBox)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: visible;
`;

const RequestText = styled.div`
  font-size: 14px;
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
  border: none;
  border-radius: 8px;
  color: white;
  padding: 0 12px;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.65);
  }

  &:focus {
    outline: none;
    border: none;
    background: rgba(255, 255, 255, 0.16);
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
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  height: 56px;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.sub};
  gap: 4px;
  padding: 6px;
  border-radius: 8px;
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
