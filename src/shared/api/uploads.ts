import axios from "axios";
import { apiClient } from "./axios";
import type { ApiResponse } from "../types/common.type";

export interface PresignedUrlReq {
  uploadType: "POST_IMAGE" | "MARKER_IMAGE" | "PROFILE_IMAGE";
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

export const MultiplePresignedUrls = async (body: PresignedUrlReq) => {
  const res = await apiClient.post<ApiResponse<PresignedUrlRes>>(
    "/api/v1/uploads/presigned-urls",
    body,
  );
  return res.data.data;
};

export const SinglePresignedUrl = async (body: PresignedUrlReq) => {
  const res = await apiClient.post<ApiResponse<PresignedUrlRes>>(
    "/api/v1/uploads/presigned-url",
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
