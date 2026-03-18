import styled from "styled-components";
import { StitchedBox } from "../../../shared/ui/StitchedBox";
import type { Friend } from "@/shared/types/friend.type";

const FriendItem = ({ friend }: { friend: Friend }) => {
  return (
    <Container>
      <Left>
        <Avator />
        <NameBox>
          <NickName>{friend.user?.nickname}</NickName>
          <Name>{friend.user.realName}</Name>
        </NameBox>
      </Left>
      <Right>
        <RemoveButton>REMOVE</RemoveButton>
        <AcceptButton>ACCEPT</AcceptButton>
        <RejectButton>REJECT</RejectButton>
      </Right>
    </Container>
  );
};

export default FriendItem;

const Container = styled(StitchedBox)`
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Avator = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
  flex-shrink: 0;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
`;

const NickName = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
`;

const Name = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
  line-height: 1.2;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const Button = styled.button`
  min-width: 72px;
  height: 32px;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  cursor: pointer;
  white-space: nowrap;
`;

const RemoveButton = styled(Button)`
  background: #c48b58;
  border: 1px solid #a67142;
`;

const AcceptButton = styled(Button)`
  background: #15803d;
  border: 1px solid #166534;
`;

const RejectButton = styled(Button)`
  background: #b91c1c;
  border: 1px solid #991b1b;
`;
