import styled from "styled-components";

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
  return (
    <ModalContainer>
      <ModalTitle>프로필 수정</ModalTitle>

      <ModalBody>
        {/* 여기에 프로필 수정 내용(Input, Image 업로드 등)을 넣으세요 */}
        <p>프로필 정보를 수정하는 공간입니다.</p>
      </ModalBody>

      <ButtonWrapper>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ButtonWrapper>
    </ModalContainer>
  );
};

export default ProfileModal;

const ModalContainer = styled.div`
  background: white;
  width: 600px;
  min-height: 400px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const ModalBody = styled.div`
  flex: 1;
  margin-top: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const CloseButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
