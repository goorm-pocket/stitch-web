import styled from "styled-components";
import type { Post } from "../../shared/types/post.type";

interface PostFormProps {
  post: Post;
}

const PostForm = ({ post }: PostFormProps) => {
  const representativeImage = post.images?.[0]?.image_url;

  return (
    <Container>
      <Header>
        <AuthorRow>
          <Avatar
            src={post.author.profile_image_url ?? "https://i.pravatar.cc/100"}
            alt={post.author.nickname}
          />
          <AuthorInfo>
            <Nickname>{post.author.nickname}</Nickname>
            <DateText>{new Date(post.created_at).toLocaleDateString()}</DateText>
          </AuthorInfo>
        </AuthorRow>

        <LikeButton $liked={post.liked_by_me}>
          <HeartIcon $liked={post.liked_by_me}>❤</HeartIcon>
          <span>{post.like_count}</span>
        </LikeButton>
      </Header>

      <ImageSection>
        {post.marker_type === "EMOJI" && post.marker_emoji && (
          <MarkerBadge>
            <Marker>{post.marker_emoji}</Marker>
          </MarkerBadge>
        )}

        {post.marker_type === "IMAGE" && post.marker_image_url && (
          <MarkerBadge>
            <MarkerImage src={post.marker_image_url} alt="marker" />
          </MarkerBadge>
        )}

        {representativeImage ? (
          <PostImage src={representativeImage} alt="post" />
        ) : (
          <ImageFallback>
            <FallbackText>No image</FallbackText>
          </ImageFallback>
        )}
      </ImageSection>

      {post.content && <Content>{post.content}</Content>}
    </Container>
  );
};

export default PostForm;

const Container = styled.article`
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Nickname = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
  line-height: 1.2;
`;

const DateText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text_secondary};
  line-height: 1.2;
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  padding: 7px 12px;
  border-radius: 999px;
  background: ${({ $liked }) => ($liked ? "rgba(255, 77, 79, 0.08)" : "rgba(255, 255, 255, 0.72)")};
  backdrop-filter: blur(8px);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $liked }) => ($liked ? "#ff4d4f" : "#6b7280")};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ $liked }) => ($liked ? "rgba(255, 77, 79, 0.12)" : "rgba(15, 23, 42, 0.04)")};
  }
`;

const HeartIcon = styled.span<{ $liked: boolean }>`
  font-size: 13px;
  line-height: 1;
  filter: ${({ $liked }) => ($liked ? "drop-shadow(0 2px 4px rgba(255, 77, 79, 0.25))" : "none")};
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
`;

const MarkerBadge = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  z-index: 3;
`;

const Marker = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1;
`;

const MarkerImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
`;

const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
`;

const ImageFallback = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.sub};
`;

const FallbackText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
`;

const Content = styled.p`
  margin: 16px 2px 4px;
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.text_primary};
  word-break: keep-all;
`;
