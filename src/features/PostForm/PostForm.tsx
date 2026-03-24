import { useState } from "react";
import styled from "styled-components";
import type { Post } from "../../shared/types/post.type";
import { useCreatePostLikeMutation, useDeletePostLikeMutation } from "@/shared/hooks/usePost";

interface PostFormProps {
  post: Post;
  mode?: "default" | "detail";
}

const PostForm = ({ post, mode = "default" }: PostFormProps) => {
  // mutate
  const { mutate: createPostLike } = useCreatePostLikeMutation({ postId: post.postId });
  const { mutate: deletePostLike } = useDeletePostLikeMutation({ postId: post.postId });

  const images = post.images ?? [];
  const representativeImage = images[0]?.imageUrl;

  const isDetailMode = mode === "detail";
  const shouldShowSlider = isDetailMode && images.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.likedByMe) {
      deletePostLike({ postId: post.postId });
    } else {
      createPostLike({ postId: post.postId });
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Container>
      <Header>
        <AuthorRow>
          <Avatar
            src={post.author.profileImageUrl ?? "https://i.pravatar.cc/100"}
            alt={post.author.nickname}
          />
          <AuthorInfo>
            <Nickname>{post.author.nickname}</Nickname>
            <DateText>{new Date(post.createdAt).toLocaleDateString()}</DateText>
          </AuthorInfo>
        </AuthorRow>

        <LikeButton $liked={post.likedByMe} onClick={handleLike}>
          <HeartIcon $liked={post.likedByMe}>❤</HeartIcon>
          <span>{post.likeCount}</span>
        </LikeButton>
      </Header>

      <ImageSection>
        {post.markerType === "EMOJI" && post.markerEmoji && (
          <MarkerBadge>
            <Marker>{post.markerEmoji}</Marker>
          </MarkerBadge>
        )}

        {post.markerType === "IMAGE" && post.markerImageUrl && (
          <MarkerBadge>
            <MarkerImage src={post.markerImageUrl} alt="marker" />
          </MarkerBadge>
        )}

        {shouldShowSlider ? (
          <SliderWrapper>
            <PostImage src={images[currentIndex].imageUrl} alt={`post-${currentIndex + 1}`} />

            <NavButton $left onClick={handlePrev} type="button">
              ‹
            </NavButton>
            <NavButton onClick={handleNext} type="button">
              ›
            </NavButton>

            <Indicator>
              {images.map((_, index) => (
                <Dot key={index} $active={index === currentIndex} />
              ))}
            </Indicator>
          </SliderWrapper>
        ) : representativeImage ? (
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

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
`;

const NavButton = styled.button<{ $left?: boolean }>`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? "left: 12px;" : "right: 12px;")}
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.92);
  }
`;

const Indicator = styled.div`
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "18px" : "6px")};
  height: 6px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)")};
  transition: all 0.2s ease;
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
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const Content = styled.p`
  margin: 16px 2px 4px;
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.text_primary};
  word-break: keep-all;
`;
