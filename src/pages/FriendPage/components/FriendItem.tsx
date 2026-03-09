import styled from "styled-components";
import { StitchedBox } from "../../../shared/ui/StitchedBox";

const FriendItem = () => {
  return (
    <Container>
      <Left>
        <Avator />
        <NameBox>
          <NickName>xode114kr1</NickName>
          <Name>신윤호</Name>
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
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const Left = styled.div`
  display: flex;
  gap: 16px;
`;

const Avator = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NickName = styled.div`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const Name = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const Right = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
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
