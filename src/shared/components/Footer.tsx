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
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: white;
`;

const NavItem = styled.div`
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: 14px;
`;
