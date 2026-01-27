import { Buffer } from "node:buffer"
import { logger } from "@/shared/lib/tools/logger"
import { getAllConfigs } from "@/shared/model/config.model"

export interface S3Config {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
  endpoint: string
  customDomain?: string
}

export interface UploadOptions {
  folder?: string
  filename?: string
  contentType?: string
  isPublic?: boolean
}

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export class S3Service {
  private config: S3Config

  constructor(config?: Partial<S3Config>) {
    this.config = {
      accessKeyId: config?.accessKeyId || process.env.STORAGE_ACCESS_KEY_ID || "",
      secretAccessKey: config?.secretAccessKey || process.env.STORAGE_SECRET_ACCESS_KEY || "",
      region: config?.region || process.env.STORAGE_REGION || "auto",
      bucket: config?.bucket || process.env.STORAGE_BUCKET_NAME || "",
      endpoint: config?.endpoint || process.env.STORAGE_ENDPOINT || "",
      customDomain: config?.customDomain || process.env.STORAGE_PUBLIC_URL || undefined,
    }

    if (
      !this.config.accessKeyId ||
      !this.config.secretAccessKey ||
      !this.config.bucket ||
      !this.config.endpoint
    ) {
      throw new Error(
        "Missing required S3 configuration. Please check environment variables: STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_BUCKET_NAME, STORAGE_ENDPOINT"
      )
    }
  }

  private buildUrl(key: string): string {
    return `${this.config.endpoint}/${this.config.bucket}/${key}`
  }

  private async createClient() {
    return import("aws4fetch").then(({ AwsClient }) => {
      return new AwsClient({
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
        region: this.config.region,
      })
    })
  }

  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      if (!buffer || buffer.length === 0) {
        return { success: false, error: "Buffer is required and cannot be empty" }
      }
      if (!filename || filename.trim() === "") {
        return { success: false, error: "Filename is required and cannot be empty" }
      }

      const maxSize = 100 * 1024 * 1024
      if (buffer.length > maxSize) {
        return {
          success: false,
          error: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`,
        }
      }

      const {
        folder = "uploads",
        contentType = "application/octet-stream",
        isPublic = true,
      } = options

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const finalFilename = options.filename || `${timestamp}-${filename}`
      const key = folder ? `${folder}/${finalFilename}` : finalFilename

      const url = this.buildUrl(key)

      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
      }

      const client = await this.createClient()
      const request = new Request(url, { method: "PUT", headers, body: buffer as BodyInit })
      const response = await client.fetch(request)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error("S3 upload failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url,
        })
        return { success: false, error: `Upload failed: ${response.status} ${response.statusText}` }
      }

      const publicUrl = this.config.customDomain
        ? `${this.config.customDomain}/${key}`
        : isPublic
          ? url
          : undefined
      logger.info("S3 upload successful:", { key, url: publicUrl })
      return { success: true, url: publicUrl, key }
    } catch (error) {
      logger.error("S3 upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async uploadBase64Data(
    base64Data: string,
    filename: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      if (!base64Data || base64Data.trim() === "") {
        return { success: false, error: "Base64 data is required and cannot be empty" }
      }
      if (!filename || filename.trim() === "") {
        return { success: false, error: "Filename is required and cannot be empty" }
      }

      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        return {
          success: false,
          error:
            "Invalid base64 data format. Expected format: data:image/png;base64,<data> or data:audio/mp3;base64,<data>",
        }
      }

      const contentType = matches[1] || "image/png"
      const buffer = Buffer.from(matches[2], "base64")

      const extension = this.getExtensionFromMimeType(contentType)
      const finalFilename = filename.includes(".") ? filename : `${filename}.${extension}`
      const defaultFolder = contentType.startsWith("audio/") ? "audio" : "images"

      return await this.uploadBuffer(buffer, finalFilename, {
        ...options,
        contentType,
        folder: options.folder || defaultFolder,
      })
    } catch (error) {
      logger.error("S3 base64 upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async uploadImageFromUrl(
    imageUrl: string,
    filename: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch image: ${response.status} ${response.statusText}`,
        }
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      const contentType = response.headers.get("content-type") || "image/png"
      const extension = this.getExtensionFromMimeType(contentType)
      const finalFilename = filename.includes(".") ? filename : `${filename}.${extension}`
      return await this.uploadBuffer(buffer, finalFilename, {
        ...options,
        contentType,
        folder: options.folder || "images",
      })
    } catch (error) {
      logger.error("S3 image URL upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const url = this.buildUrl(key)
      const client = await this.createClient()
      const request = new Request(url, { method: "DELETE" })
      const response = await client.fetch(request)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error("S3 delete failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url,
        })
        return { success: false, error: `Delete failed: ${response.status} ${response.statusText}` }
      }

      logger.info("S3 delete successful:", { key })
      return { success: true }
    } catch (error) {
      logger.error("S3 delete error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  generateTimestampKey(filename: string, folder?: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const finalFilename = `${timestamp}-${filename}`
    return folder ? `${folder}/${finalFilename}` : finalFilename
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
      "image/tiff": "tiff",
      "text/plain": "txt",
      "application/pdf": "pdf",
      "application/json": "json",
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "audio/aac": "aac",
      "audio/flac": "flac",
      "audio/opus": "opus",
      "audio/webm": "webm",
    }
    return mimeToExt[mimeType] || "bin"
  }
}

/**
 * Get the storage provider based on config
 */
export async function getStorageProvider(): Promise<S3Service> {
  const configs = await getAllConfigs()
  return new S3Service({
    accessKeyId: configs.storage_access_key_id,
    secretAccessKey: configs.storage_secret_access_key,
    region: configs.storage_region,
    bucket: configs.storage_bucket_name,
    endpoint: configs.storage_endpoint,
    customDomain: configs.storage_public_url,
  })
}
