import { useLogoutMutation } from "@/shared/hooks/useAuth";
import { useNavigate } from "react-router";
import styled from "styled-components";

const ActionSection = () => {
  const navigate = useNavigate();
  const { mutateAsync: logout } = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <DeleteButton>Delete Account</DeleteButton>
    </Container>
  );
};

export default ActionSection;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const LogoutButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_primary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const DeleteButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fecaca;
  }
`;
