import styled from "styled-components";
import Logo from "../../assets/logo.svg";
import BoardIcon from "../../assets/board-icon.svg";
import FriendIcon from "../../assets/friend-icon.svg";
import ArchiveIcon from "../../assets/archive-icon.svg";
import ProfileModal from "../../features/ProfileModal/ProfileModal";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useGetProfileQuery } from "../hooks/useUser";
import Notification from "@/features/Notification/NotificationDropdown";
import { useFetchMeQuery } from "../hooks/useAuth";
import { handleKakaoLogin } from "../utils/login";

const Header = () => {
  const { isError } = useFetchMeQuery();
  const { data: profile } = useGetProfileQuery();

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <HeaderContainer>
      <Left onClick={() => navigate("/pocket")}>
        <Logo />
        <LogoText>Stitch</LogoText>
      </Left>
      <Mid>
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
      </Mid>
      <Right>
        {!isError ? (
          <>
            <Notification />
            <AvatorBox>
              <AvatorButton onClick={openModal}>
                <Avator src={profile?.profileImageUrl} />
              </AvatorButton>
            </AvatorBox>
          </>
        ) : (
          <ButtonContainer>
            <LoginButton onClick={handleKakaoLogin}>Login</LoginButton>
          </ButtonContainer>
        )}
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
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.sub};
  padding: 12px ${({ theme }) => theme.layout.pagePadding};
  background-color: ${({ theme }) => theme.colors.surface};
  gap: ${({ theme }) => theme.space.lg};

  @media (max-width: 768px) {
    min-height: auto;
    flex-wrap: wrap;
    padding-top: 14px;
    padding-bottom: 14px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  cursor: pointer;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-size: clamp(18px, 2vw, 20px);
  font-weight: bold;

  @media (max-width: 480px) {
    display: none;
  }
`;

const Mid = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  min-width: 0;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  min-width: 0;
  flex-wrap: wrap;
  width: min(350px, 100%);

  justify-content: space-evenly;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.icon};
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadows.xs};
  }
`;

const NavIcon = styled.svg`
  color: currentColor;
  flex-shrink: 0;
`;

const NavText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;

  @media (max-width: 767px) {
    display: none;
  }
`;

const AvatorBox = styled.div`
  padding-left: ${({ theme }) => theme.space.md};
  margin-left: ${({ theme }) => theme.space.md};
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 480px) {
    padding-left: ${({ theme }) => theme.space.sm};
    margin-left: ${({ theme }) => theme.space.sm};
  }
`;

const Avator = styled.img`
  width: 45px;
  height: 45px;
  border-radius: ${({ theme }) => theme.radii.round};
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
  background: ${({ theme }) => theme.colors.hover};
`;

const AvatorButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover ${Avator} {
    border-color: ${({ theme }) => theme.colors.border3};
    box-shadow: ${({ theme }) => theme.shadows.xs};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ButtonContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.sub};
  border: none;
  border-radius: ${({ theme }) => theme.radii.xs};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;

  box-shadow: ${({ theme }) => theme.shadows.xs};
  cursor: pointer;

  padding: ${({ theme }) => theme.space.md};

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 6px 9px;
    font-size: 11px;
    height: 32px;
  }
`;
