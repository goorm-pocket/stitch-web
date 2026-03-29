import styled from "styled-components";

export const SettingsSection = styled.section`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.sub};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  overflow: hidden;
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: bold;
  padding: ${({ theme }) => theme.space.xl};
  gap: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.text_primary};

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.fontSize.lg};
    padding: 14px 16px;
    gap: ${({ theme }) => theme.space.sm};
    flex-wrap: wrap;
  }
`;

export const SectionList = styled.div<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition:
    opacity ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    filter ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
`;

export const SectionItem = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.xl};

  @media (max-width: 640px) {
    padding: 13px 16px;
    gap: ${({ theme }) => theme.space.sm};
  }
`;

export const SectionLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
  gap: ${({ theme }) => theme.space.md};

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.fontSize.md};
    gap: ${({ theme }) => theme.space.sm};
  }
`;

export const SectionToggle = styled.input.attrs({ type: "checkbox" })`
  margin-left: auto;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: none;
  outline: none;
  background: ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: ${({ theme }) => theme.radii.round};
    background: white;
    transition: transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
    transform: translateX(0);
  }

  &:checked::after {
    transform: translateX(20px);
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 22px;

    &::after {
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
    }

    &:checked::after {
      transform: translateX(18px);
    }
  }
`;
