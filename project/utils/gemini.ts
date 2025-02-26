import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCwZasYQhiKoym1o8xdl5l0Wa223TuXiNc');

export async function analyzeImage(
  imageUrl: string,
  coordinates: { latitude: number; longitude: number },
  language: string = 'english'
) {
  try {
    // Fetch the image and convert it to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await imageResponse.blob();
    const imageBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    // Remove the data URL prefix to get just the base64 string
    const base64String = (imageBase64 as string).split(',')[1];

    // Get the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const prompt = `You are an expert historian and cultural guide. Analyze this image of a historical place and provide detailed information about its significance, history, and interesting stories. Consider the following aspects:

1. Historical significance
2. Architectural features
3. Cultural importance
4. Key historical events
5. Interesting facts and stories

The image was taken at coordinates: ${coordinates.latitude}, ${coordinates.longitude}. 
Please respond in ${language} with a well-structured analysis.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64String
        }
      }
    ]);

    const textResult = await result.response;
    return textResult.text();
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze image');
  }
}