import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *{
        box-sizing:border-box
    }
    body{
        background-color:${({ theme }) => theme.colors.background};
        margin:0;
        padding:0;
    }
`;
