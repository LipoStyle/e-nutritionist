import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function safeExtFromContentType(ct: string) {
  // extremely small allowlist
  if (ct === 'image/jpeg') return 'jpg';
  if (ct === 'image/png') return 'png';
  if (ct === 'image/webp') return 'webp';
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || 'upload';
    const contentType = searchParams.get('contentType') || '';
    const keyHint = (searchParams.get('keyHint') || 'recipe').toLowerCase().replace(/[^a-z0-9\-]+/g, '-');

    const ext = safeExtFromContentType(contentType);
    if (!ext) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const uuid = crypto.randomUUID();
    // Folder convention: recipes/<hint>/uuid.ext
    const key = `recipes/${keyHint}/${uuid}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: contentType,
      // Optional: you could add CacheControl here
      // CacheControl: 'public, max-age=31536000, immutable',
      ACL: undefined, // bucket owner enforced (no ACLs)
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 }); // 60s
    const publicUrl = `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${key}`;

    return NextResponse.json({ url, key, publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create presigned URL' }, { status: 500 });
  }
}
