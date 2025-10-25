import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const content = await req.text();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ ok: false, error: 'Conteúdo do .env vazio' }, { status: 400 });
  }

  const envPath = path.join(process.cwd(), '.env');
  await writeFile(envPath, content, { encoding: 'utf-8' });

  return NextResponse.json({ ok: true, message: 'Arquivo .env salvo com sucesso.' });
}