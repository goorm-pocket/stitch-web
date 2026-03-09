import styled from "styled-components";

const MyPage = () => {
  return (
    <Container>
      <ProfileContainer>
        <Left>
          <Avator />
          <ProfileTextBox>
            <ProfileName>xode114kr1</ProfileName>
            <ProfileDescription>신윤호</ProfileDescription>
            <BadgeContainer>
              <Badge>
                <BadgeNumber>1.2k</BadgeNumber>
                <span>FRIENDS</span>
              </Badge>
              <Badge>
                <BadgeNumber>48</BadgeNumber>
                <span>POCKET</span>
              </Badge>
            </BadgeContainer>
          </ProfileTextBox>
        </Left>
        <Right>
          <SettingButton>Settings</SettingButton>
        </Right>
      </ProfileContainer>
    </Container>
  );
};

export default MyPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 1150px;
  padding: 16px 32px;
  gap: 32px;
`;

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  padding: 28px;
  background: white;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 2px dashed ${({ theme }) => theme.colors.sub};
    border-radius: 8px;
    pointer-events: none;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Avator = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;

const ProfileTextBox = styled.div``;

const ProfileName = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const ProfileDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const BadgeContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
`;

const Badge = styled.div`
  background: ${({ theme }) => theme.colors.sub};
  padding: 10px 16px;
  border-radius: 9999px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text_secondary};
  font-weight: bold;
`;

const BadgeNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  &::after {
    content: " ";
  }
`;

const Button = styled.button`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
`;

const SettingButton = styled(Button)`
  width: 130px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
`;
