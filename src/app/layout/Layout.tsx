import styled from "styled-components";
import { Outlet } from "react-router";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";

const Layout = () => {
  return (
    <Wrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 0;
  padding: 0 ${({ theme }) => theme.layout.pagePadding};
`;
