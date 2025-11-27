import { NextResponse } from 'next/server';
import { openApiDocument } from '@repo/api';

export async function GET() {
    return NextResponse.json(openApiDocument);
}
