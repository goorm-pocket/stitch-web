import styled, { keyframes } from "styled-components";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const sizeMap = {
  sm: "20px",
  md: "32px",
  lg: "48px",
};

const thicknessMap = {
  sm: "2px",
  md: "3px",
  lg: "4px",
};

const LoadingSpinner = ({ size = "md", message, className }: LoadingSpinnerProps) => {
  return (
    <Wrapper className={className}>
      <Spinner $size={size} />
      {message && <Message>{message}</Message>}
    </Wrapper>
  );
};

export default LoadingSpinner;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
`;

const Spinner = styled.div<{ $size: SpinnerSize }>`
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
  border-radius: 50%;
  border: ${({ $size }) => thicknessMap[$size]} solid ${({ theme }) => theme.colors.sub};
  border-top: ${({ $size }) => thicknessMap[$size]} solid ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text_secondary};
`;
