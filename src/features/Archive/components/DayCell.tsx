import type dayjs from "dayjs";
import styled from "styled-components";
import type { Calendar } from "../../../shared/types/post.type";
import Bubble from "../../../shared/components/Bubble";

interface DayCellProps {
  cell: {
    date: dayjs.Dayjs | null;
  };
  dayData: Calendar | undefined;
}

const DayCell = ({ cell, dayData }: DayCellProps) => {
  return (
    <Container $empty={!cell.date} $variant={dayData?.hasPost}>
      {cell.date && (
        <>
          <DateNumber>{cell.date.date()}</DateNumber>
          {dayData?.hasPost && <Bubble markers={dayData?.markers} />}
        </>
      )}
    </Container>
  );
};

export default DayCell;

const Container = styled.button<{ $empty?: boolean; $variant?: boolean }>`
  position: relative;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 0 0 18px 18px;
  cursor: pointer;
  background: ${({ $empty, $variant, theme }) => {
    if ($empty) return "transparent";
    if ($variant) return theme.colors.primary;
    return "#E9EEF3";
  }};

  &::before {
    content: "";
    position: absolute;
    inset: 5%;
    border: ${({ $empty, theme }) => {
      if ($empty) return "none";
      return `1px dashed ${theme.colors.sub};`;
    }};
    border-radius: 0 0 16px 16px;
  }
`;

const DateNumber = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_primary};
`;
