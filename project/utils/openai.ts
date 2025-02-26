import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeImage(
  imageUrl: string,
  coordinates: { latitude: number; longitude: number },
  language: string = 'english'
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert historian and cultural guide. Analyze the image and provide detailed information about the historical place, its significance, and interesting stories. Respond in ${language}.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: imageUrl,
            },
            {
              type: 'text',
              text: `This image was taken at coordinates: ${coordinates.latitude}, ${coordinates.longitude}. Please provide detailed information about this historical place.`,
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}