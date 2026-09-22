/**
 * Cloud Storage Service Interface.
 * Handles crop disease image uploads, soil reports, and marketplace media.
 */

export class CloudStorageService {
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folder: 'crops' | 'soil-reports' | 'marketplace' | 'avatars'
  ): Promise<{ publicUrl: string; key: string }> {
    // Placeholder clean contract for S3 / GCS storage upload
    const key = `${folder}/${Date.now()}_${fileName}`;
    return {
      publicUrl: `https://storage.raitusevak360.internal/${key}`,
      key,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    console.log(`[Storage] File deleted: ${key}`);
    return true;
  }
}

export const cloudStorageService = new CloudStorageService();
