import styled from "styled-components";
import PostForm from "../../features/Post/PostForm";

const PostDetailPage = () => {
  return (
    <Container>
      <PostForm />
    </Container>
  );
};

export default PostDetailPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 900px;
  padding: 12px 28px;
  gap: 24px;
`;
