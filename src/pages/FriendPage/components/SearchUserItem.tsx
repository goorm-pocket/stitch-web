import type { SearchUser } from "@/shared/types/user.type";
import styled from "styled-components";

interface SearchUserItemProps {
  user: SearchUser;
  handleAdd: (e: React.MouseEvent) => void;
  handleClick: () => void;
}

const SearchUserItem = ({ user, handleAdd, handleClick }: SearchUserItemProps) => {
  return (
    <Container onClick={handleClick}>
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
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

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
  border-radius: ${({ theme }) => theme.radii.pill};
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileEmojiBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.pill};
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
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const AddButton = styled.button`
  border: none;
  height: 36px;
  min-width: 88px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radii.xs};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  &:disabled {
    background: ${({ theme }) => theme.colors.sub};
    color: ${({ theme }) => theme.colors.text_secondary};
    cursor: not-allowed;
  }
`;
