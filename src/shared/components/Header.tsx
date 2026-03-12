import styled from "styled-components";
import Logo from "../../assets/logo.svg";
import BoardIcon from "../../assets/board-icon.svg";
import FriendIcon from "../../assets/friend-icon.svg";
import ArchiveIcon from "../../assets/archive-icon.svg";
import ProfileModal from "../../Modal/ProfileModal/ProfileModal";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  //const toggleModal = () => setIsModalOpen(!isModalOpen);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <HeaderContainer>
      <Left onClick={() => navigate("/")}>
        <Logo />
        <LogoText>Stitch</LogoText>
      </Left>
      <Right>
        <NavBar>
          <NavItem to="/pocket">
            <NavIcon as={BoardIcon} />
            <NavText>Pocket</NavText>
          </NavItem>

          <NavItem to="/friend">
            <NavIcon as={FriendIcon} />
            <NavText>Friends</NavText>
          </NavItem>

          <NavItem to="/mypage">
            <NavIcon as={ArchiveIcon} />
            <NavText>My Page</NavText>
          </NavItem>
        </NavBar>
        <AvatorBox>
          <AvatorButton onClick={openModal}>
            <Avator></Avator>
          </AvatorButton>
        </AvatorBox>
      </Right>

      {isModalOpen && (
        <ModalOverlay>
          <ProfileModal onClose={closeModal} />
        </ModalOverlay>
      )}
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

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
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

const NavItem = styled(NavLink)`
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

const AvatorButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
