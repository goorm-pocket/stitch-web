import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <NavItem>Terms of Service</NavItem>
      <NavItem>Privacy Policy</NavItem>
      <NavItem>Help Center</NavItem>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xxl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.xl};

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 10px 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
`;

const NavItem = styled.div`
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.md};
`;
