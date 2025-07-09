export interface CloudinaryUploadResponse {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}