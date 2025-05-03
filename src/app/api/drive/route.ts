import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/callback/google`
);

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  oauth2Client.setCredentials({
    access_token: session.accessToken
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    const res = await drive.files.list({
      q: "name='app-data.json' and trashed=false",
      fields: 'files(id, name)',
    });

    if (res.data.files?.length) {
      const file = res.data.files[0];
      const fileRes = await drive.files.get({
        fileId: file.id!,
        alt: 'media'
      });
      return NextResponse.json(fileRes.data);
    }

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const data = await request.json();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  oauth2Client.setCredentials({
    access_token: session.accessToken
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    // Check if file exists
    const res = await drive.files.list({
      q: "name='app-data.json' and trashed=false",
      fields: 'files(id, name)',
    });

    if (res.data.files?.length) {
      // Update existing file
      const file = res.data.files[0];
      await drive.files.update({
        fileId: file.id!,
        media: {
          mimeType: 'application/json',
          body: JSON.stringify(data)
        }
      });
    } else {
      // Create new file
      await drive.files.create({
        media: {
          mimeType: 'application/json',
          body: JSON.stringify(data)
        },
        requestBody: {
          name: 'app-data.json',
          parents: ['root']
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}