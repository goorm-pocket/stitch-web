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
  padding: 12px 28px;
  gap: 24px;
`;

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  padding: 20px;
  background: white;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    border: 2px dashed ${({ theme }) => theme.colors.sub};
    border-radius: 8px;
    pointer-events: none;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Avator = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;

const ProfileTextBox = styled.div``;

const ProfileName = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const ProfileDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const BadgeContainer = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;
`;

const Badge = styled.div`
  background: ${({ theme }) => theme.colors.sub};
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
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
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
`;

const SettingButton = styled(Button)`
  width: 110px;
  height: 34px;
  background: ${({ theme }) => theme.colors.primary};
`;
