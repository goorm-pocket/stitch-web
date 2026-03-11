import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import FriendItem from "./components/FriendItem";
import { useState } from "react";

const FriendPage = () => {
  const [selectList, setSelectList] = useState<"friend" | "sent" | "received">("friend");
  return (
    <Container>
      <TitleContainer>
        <Title>Friend</Title>
        <Description>Manage your friend community</Description>
      </TitleContainer>
      <RequestInputContainer>
        <RequestText>Search and Add Friends</RequestText>
        <RequestInputBox>
          <RequestInput placeholder="Enter username..." />
          <RequestButton>Add Friend</RequestButton>
        </RequestInputBox>
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
        <FriendItem />
        <FriendItem />
        <FriendItem />
        <FriendItem />
        <FriendItem />
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
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const RequestInputContainer = styled(StitchedBox)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 125px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 20px;
`;

const RequestText = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;

const RequestInputBox = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

const RequestInput = styled.input`
  flex: 3;
  height: 43px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding-left: 10px;

  &:focus {
    outline: none;
    border: none;
  }
`;

const RequestButton = styled.button`
  flex: 1;
  height: 43px;
  max-width: 140px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;

  color: white;
  font-size: 14px;
  font-weight: bold;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
  font-weight: bold;
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
