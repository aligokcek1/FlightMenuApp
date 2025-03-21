import { NextResponse } from 'next/server';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
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

    // Update system message with current menu
    const systemMessage = {
      role: "system",
      content: `You are a specialized flight menu assistant focused solely on helping passengers with their meal selections. 
You must always respond in the same language as the user's message.

Current available menu items:
${JSON.stringify(menuItems, null, 2)}

Your responsibilities are strictly limited to:
1. Providing information about the current menu items
2. Answering questions about ingredients and dietary restrictions
3. Making menu recommendations based on dietary preferences
4. Explaining meal options and their components from the current menu only

Important rules:
- Always respond in the user's language
- Only reference items from the current menu
- When referring to menu items, use their translated names based on the user's language
- Only discuss topics related to the current menu and food items
- Keep responses focused and concise

If asked about anything outside of the current menu items, politely redirect the conversation back to the available options.`
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
