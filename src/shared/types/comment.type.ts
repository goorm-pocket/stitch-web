export interface CommentAuthor {
  userId: string;
  nickname: string;
  profileImageUrl: string;
}

export interface CommentMention {
  userId: string;
  isSystemGenerated: boolean;
  startIndex: number;
  endIndex: number;
}

export interface Comment {
  commentId: string;
  author: CommentAuthor;
  content: string;
  depth: number;
  parentId: string | null;
  rootId: string;
  hasChild: boolean;
  status: "ACTIVE" | "DELETED";
  mentions: CommentMention[];
  createdAt: string;
  updatedAt: string;
}

export interface GetCommentsResponse {
  comments: Comment[];
  hasNext: boolean;
  nextCursor: string | null;
}
