interface ChatGPTResponse {
  menuItems: {
    category: string;
    items: Array<{
      en: { name: string; description: string | null };
      tr: { name: string; description: string | null };
      dietaryInfo?: string[];
    }>;
  }[];
}

interface FormattedMenu {
  [category: string]: Array<{
    name: string;
    description: string;
    category: string;
    translations: {
      en: { name: string; description: string };
      tr: { name: string; description: string };
    };
    languages: string[];
    dietaryInfo: string[];
    selected: boolean;
  }>;
}

export class ChatGPTService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  static async processMenuImage(base64Image: string): Promise<ChatGPTResponse> {
    try {
      if (!this.API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const base64Content = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this menu image and categorize items into sections. For each item, provide English and Turkish names and descriptions. Format your response as a JSON object with this exact structure (no additional text):\n\n{\"menuItems\":[{\"category\":\"Category Name\",\"items\":[{\"en\":{\"name\":\"Item Name\",\"description\":\"Item Description\"},\"tr\":{\"name\":\"Turkish Name\",\"description\":\"Turkish Description\"},\"dietaryInfo\":[\"vegetarian\",\"vegan\",\"dairy\",\"meat\",\"seafood\"]}]}]}"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Content}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4096,
          temperature: 0.3 // Lower temperature for more consistent output
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`ChatGPT API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from ChatGPT');
      }

      // Clean and parse the response
      const content = data.choices[0].message.content.trim();
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      const jsonString = content.slice(jsonStart, jsonEnd);

      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.menuItems || !Array.isArray(parsed.menuItems)) {
          throw new Error('Invalid menu items format');
        }
        return parsed;
      } catch {
        console.error('Parse error, raw content:', content);
        throw new Error('Failed to parse ChatGPT response');
      }
    } catch (error) {
      console.error('ChatGPT processing error:', error);
      throw error;
    }
  }

  static formatToMenuJson(gptResponse: ChatGPTResponse): FormattedMenu {
    try {
      const menuJson: FormattedMenu = {};
      
      if (!gptResponse.menuItems) {
        throw new Error('Invalid response format: missing menuItems');
      }

      gptResponse.menuItems.forEach(category => {
        if (!category.category || !Array.isArray(category.items)) {
          throw new Error('Invalid category format');
        }

        // Transform items to match MenuItem interface
        const transformedItems = category.items.map(item => ({
          name: item.en.name,
          description: item.en.description || '',
          category: category.category,
          translations: {
            en: {
              name: item.en.name,
              description: item.en.description || ''
            },
            tr: {
              name: item.tr.name,
              description: item.tr.description || ''
            }
          },
          languages: ['en', 'tr'],
          dietaryInfo: item.dietaryInfo || [],
          selected: false
        }));

        menuJson[category.category] = transformedItems;
      });

      return menuJson;
    } catch (error) {
      console.error('Format error:', error);
      throw error;
    }
  }
}
