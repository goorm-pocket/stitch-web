import styled from "styled-components";
import Logo from "../../assets/logo.svg";
import BoardIcon from "../../assets/board-icon.svg";
import FriendIcon from "../../assets/friend-icon.svg";
import ArchiveIcon from "../../assets/archive-icon.svg";
import { NavLink, useNavigate, useLocation } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <HeaderContainer>
      <Left onClick={() => !isLoginPage && navigate("/")} $disabled={isLoginPage}>
        <Logo />
        <LogoText>Stitch</LogoText>
      </Left>
      <Right>
        <NavBar>
          <NavItem to="/" $disabled={isLoginPage}>
            <NavIcon as={BoardIcon} />
            <NavText>Board</NavText>
          </NavItem>

          <NavItem to="/friend" $disabled={isLoginPage}>
            <NavIcon as={FriendIcon} />
            <NavText>Friends</NavText>
          </NavItem>

          <NavItem to="/mypage" $disabled={isLoginPage}>
            <NavIcon as={ArchiveIcon} />
            <NavText>My Page</NavText>
          </NavItem>
        </NavBar>
        <AvatorBox>
          <AvatorItem to="/login">
            <Avator></Avator>
          </AvatorItem>
        </AvatorBox>
      </Right>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.sub};
  padding: 0 24px;
  background-color: white;
`;

const Left = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const Right = styled.div`
  display: flex;
  gap: 15px;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const NavItem = styled(NavLink)<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.icon};
  gap: 2px;

  ${({ $disabled }) =>
    $disabled &&
    `
    pointer-events: none; 
    opacity: 0.5;    
    cursor: default;
  `}

  &:hover {
    color: ${({ theme, $disabled }) => ($disabled ? "inherit" : theme.colors.primary)};
  }

  &.active {
    color: ${({ theme, $disabled }) => ($disabled ? "inherit" : theme.colors.primary)};
  }
`;

const AvatorItem = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.icon};
  gap: 2px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavIcon = styled.svg`
  color: currentColor;
`;

const NavText = styled.span`
  font-size: 14px;
  font-weight: bold;

  @media (max-width: 390px) {
    display: none;
  }
`;

const AvatorBox = styled.div`
  padding-left: 15px;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avator = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;
