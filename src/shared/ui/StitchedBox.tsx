import styled, { css } from "styled-components";

const stitchedStyle = css`
  position: relative;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px dashed ${({ theme }) => theme.colors.sub};
    border-radius: ${({ theme }) => theme.radii.md};
    pointer-events: none;
  }
`;

const ProfileStitchedStyle = css`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 2px dashed ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    pointer-events: none;
  }
`;

export const StitchedBox = styled.div`
  ${stitchedStyle};
`;

export const ProfileStitchedBox = styled.div`
  ${ProfileStitchedStyle};
`;
