import styled, { css } from "styled-components";

const stitchedStyle = css`
  position: relative;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px dashed ${({ theme }) => theme.colors.sub};
    border-radius: 8px;
    pointer-events: none;
  }
`;

export const StitchedBox = styled.div`
  ${stitchedStyle};
`;
