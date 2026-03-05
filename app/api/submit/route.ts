import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import axios from 'axios';
import { Readable } from 'stream';

export const runtime = 'nodejs';
export const maxDuration = 60;

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

async function uploadToDrive(
  drive: ReturnType<typeof google.drive>,
  folderId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
) {
  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: bufferToStream(buffer) },
    fields: 'id, webViewLink',
  });
  await drive.permissions.create({
    supportsAllDrives: true,
    fileId: res.data.id!,
    requestBody: { role: 'reader', type: 'anyone' },
  });
  return res.data.webViewLink!;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, file1, file2 } = await req.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;

    const [link1, link2] = await Promise.all([
      uploadToDrive(drive, folderId, `${name} - Part1 - ${file1.name}`, file1.type, Buffer.from(file1.data, 'base64')),
      uploadToDrive(drive, folderId, `${name} - Part2 - ${file2.name}`, file2.type, Buffer.from(file2.data, 'base64')),
    ]);

    await axios.post(process.env.ZAPIER_WEBHOOK_URL!, {
      name,
      email,
      part1_link: link1,
      part2_link: link2,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
