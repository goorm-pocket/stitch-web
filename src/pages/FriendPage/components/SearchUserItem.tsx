import type { SearchUser } from "@/shared/types/user.type";
import styled from "styled-components";

interface SearchUserItemProps {
  user: SearchUser;
  handleAdd: () => void;
}

const SearchUserItem = ({ user, handleAdd }: SearchUserItemProps) => {
  return (
    <Container>
      <UserInfo>
        {user.profileImageUrl ? (
          <ProfileImage src={user.profileImageUrl} alt={user.nickname} />
        ) : (
          <ProfileEmojiBox>{user.profileEmoji ?? "🙂"}</ProfileEmojiBox>
        )}

        <UserTextBox>
          <NicknameRow>
            <Nickname>{user.nickname}</Nickname>
          </NicknameRow>

          <SubInfoRow>{user.realName && <RealName>{user.realName}</RealName>}</SubInfoRow>
        </UserTextBox>
      </UserInfo>

      {(user.state == "NONRELATION" || user.state == "MINE") && (
        <AddButton disabled={user.state !== "NONRELATION"} onClick={handleAdd}>
          {user.mine ? "My Account" : "Add"}
        </AddButton>
      )}
    </Container>
  );
};

export default SearchUserItem;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileEmojiBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.sub};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const UserTextBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
`;

const NicknameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Nickname = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const SubInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const RealName = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const AddButton = styled.button`
  border: none;
  height: 36px;
  min-width: 88px;
  padding: 0 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    background: ${({ theme }) => theme.colors.sub};
    color: ${({ theme }) => theme.colors.text_secondary};
    cursor: not-allowed;
  }
`;
