import styled from "styled-components";

export const SettingsSection = styled.section`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.sub};
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  padding: 18px;
  gap: 12px;
  color: ${({ theme }) => theme.colors.text_primary};
`;

export const SectionList = styled.div<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition:
    opacity 0.2s ease,
    filter 0.2s ease;
`;

export const SectionItem = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  padding: 16px 18px 16px 30px;
`;

export const SectionLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
  gap: 12px;
`;

export const SectionToggle = styled.input.attrs({ type: "checkbox" })`
  margin-left: auto;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;

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
    border-radius: 50%;
    background: white;
    transition: transform 0.2s ease;
    transform: translateX(0);
  }

  &:checked::after {
    transform: translateX(20px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
