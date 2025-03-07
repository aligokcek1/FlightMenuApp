import { NextRequest, NextResponse } from 'next/server';
import { MenuOCRProcessor } from '@/lib/ocr';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' }, 
        { status: 400 }
      );
    }

    const menuItems = await MenuOCRProcessor.extractMenuText(file);

    return NextResponse.json({ 
      success: true, 
      menuItems,
      totalItems: menuItems.length
    });
  } catch (error) {
    console.error('Upload Processing Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' }, 
      { status: 500 }
    );
  }
}