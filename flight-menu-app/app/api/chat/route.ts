import { NextResponse } from 'next/server';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { messages, menuItems } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Create a system message with menu information
    const systemMessage = {
      role: "system",
      content: `You are a helpful flight menu assistant. Here are the current menu items available:
${JSON.stringify(menuItems, null, 2)}

You can provide information about dietary restrictions, ingredients, and help passengers make selections based on their preferences. When referring to menu items, use their exact names as listed.`
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
    });

    return NextResponse.json(completion.choices[0].message);
    
  } catch (error: Error | unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
