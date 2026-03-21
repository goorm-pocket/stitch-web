import axios from "axios";
import { apiClient } from "./axios";
import type { ApiResponse } from "../types/common.type";

export interface PresignedUrlReq {
  uploadType: "PROFILE_IMAGE" | "TEMP_POST_MARKER" | "TEMP_POST_IMAGE";
  files?: {
    clientFileId: string;
    contentType: string;
    fileExtension: string;
    fileSize: number;
  }[];
  //단건
  contentType?: string;
  fileExtension?: string;
  fileSize?: number;
}

export interface PresignedUrlRes {
  uploads?: {
    clientFileId: string;
    uploadUrl: string;
    key: string;
  }[];
  //단건
  uploadUrl?: string;
  key?: string;
}

export const MultiplePresignedUrls = async (userId: string, body: PresignedUrlReq) => {
  const res = await apiClient.post<ApiResponse<PresignedUrlRes>>(
    `/api/v1/uploads/presigned-urls?userId=${userId}`,
    body,
  );
  return res.data.data;
};

export const SinglePresignedUrl = async (userId: string, body: PresignedUrlReq) => {
  const res = await apiClient.post<ApiResponse<PresignedUrlRes>>(
    `/api/v1/uploads/presigned-url?userId=${userId}`,
    body,
  );
  return res.data.data;
};

//S3 업로드 함수
export const uploadFileToS3 = async (url: string, file: File | Blob) => {
  await axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};
