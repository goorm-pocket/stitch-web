import { useState } from "react";
import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";
import { useGetRecapBoardQuery } from "@/shared/hooks/useBoard";

const RecapPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const date = new Date().toISOString().slice(0, 10);
  const { data: board } = useGetRecapBoardQuery(date);

  const hasSummary = !!board?.summary;

  return (
    <Container>
      <TitleContainer>
        <Title>Recap</Title>

        {hasSummary && (
          <>
            <Subtitle $expanded={isExpanded}>{board.summary}</Subtitle>
            <DateRange>
              {board?.weekStartDate} ~ {board?.weekEndDate} 기록입니다.
            </DateRange>
            <ToggleButton type="button" onClick={() => setIsExpanded((prev) => !prev)}>
              {isExpanded ? "접기" : "더보기"}
            </ToggleButton>
          </>
        )}
      </TitleContainer>

      <Pocket board={board} mode="RECAP" />
    </Container>
  );
};

export default RecapPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(${({ theme }) => theme.layout.contentWidth}, 100%);
  padding: ${({ theme }) => theme.space.lg} 0 ${({ theme }) => theme.space.xxxl};
  gap: ${({ theme }) => theme.space.xxl};
`;

const TitleContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(36px, 8vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const Subtitle = styled.p<{ $expanded: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 0;
  margin-top: 8px;
  max-width: 640px;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;

  ${({ $expanded }) =>
    !$expanded &&
    `
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;

const DateRange = styled.div`
  margin-top: 14px;
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const ToggleButton = styled.button`
  margin-top: 10px;
  padding: 6px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text_primary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.97);
  }
`;
