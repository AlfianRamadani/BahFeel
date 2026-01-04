import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { logRequest, updateServiceStatus } from '@/lib/monitoring';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  try {
    const { type, content, language = 'en' } = await request.json();

    let messages: any[] = [];
    
    const isIndonesian = language === 'id';
    const systemLanguage = isIndonesian ? 'Bahasa Indonesia' : 'English';
    const systemPrompt = isIndonesian
      ? `Kamu adalah asisten analisis perasaan yang membantu pengguna memahami emosi mereka. Berikan analisis dalam format JSON berikut:
{
  "feeling": "Penjelasan singkat tentang perasaan apa yang sedang dialami - gunakan bahasa sederhana dan mudah dipahami",
  "protection": "Apa yang berusaha dilindungi atau dihindari oleh perasaan ini - jelaskan tanpa menilai benar-salah",
  "action": "Satu tindakan kecil dan mudah dilakukan hari ini untuk mengatasi perasaan ini - hindari saran yang rumit"
}
Gunakan bahasa yang jelas dan mudah dipahami. Berbicara seperti teman yang mendengarkan baik-baik. Fokus pada membantu pengguna memahami emosinya, bukan memberikan diagnosis medis.`
      : `You are an emotional analysis assistant that helps users understand their feelings. Provide analysis in this exact JSON format:
{
  "feeling": "A simple explanation of what emotion is being experienced - use clear and easy to understand language",
  "protection": "What this emotion is trying to protect or avoid - explain without judgment",
  "action": "One small and easy action they can do today to manage this feeling - avoid complicated suggestions"
}
Use clear and simple language. Talk like a good listener friend. Focus on helping users understand their emotions, not on providing medical diagnosis.`;

    if (type === 'text') {
      messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: isIndonesian 
            ? `Tolong berikan refleksi emosi untuk hal yang saya rasakan:\n\n${content}`
            : `Please provide an emotional reflection for what I'm expressing:\n\n${content}`
        }
      ];
    } else if (type === 'image') {
      // Parse content which might contain image + description
      let imageContent = content;
      let descriptionText = '';
      
      if (content.includes('[IMAGE]') && content.includes('[DESCRIPTION]')) {
        const parts = content.split('[DESCRIPTION]\n');
        imageContent = parts[0].replace('[IMAGE]\n', '').trim();
        descriptionText = parts[1]?.trim() || '';
      }
      
      const textContent = isIndonesian
        ? descriptionText 
          ? `Pengguna memberikan deskripsi tentang gambar ini: "${descriptionText}"\n\nTolong analisis gambar dan deskripsi ini buat memberikan refleksi emosi.`
          : 'Analisis gambar ini untuk memahami ekspresi emosi:'
        : descriptionText 
          ? `The user provided this description about the image: "${descriptionText}"\n\nPlease analyze both the image and this description to provide emotional reflection.`
          : 'Please analyze this image to understand the emotional expression:';
      
      messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: textContent
            },
            {
              type: 'image_url',
              image_url: {
                url: imageContent.startsWith('data:') ? imageContent : `data:image/jpeg;base64,${imageContent}`
              }
            }
          ]
        }
      ];
    }

    // Track OpenAI API call
    const openaiStartTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const openaiDuration = Date.now() - openaiStartTime;
    
    // Log OpenAI service as UP
    updateServiceStatus('OpenAI API', 'up', openaiDuration);

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const reflection = JSON.parse(response);

    // Log the successful request
    const duration = Date.now() - startTime;
    logRequest('/api/reflect', 'POST', 200, duration, ip);

    return NextResponse.json(reflection);
  } catch (error) {
    console.error('AI reflection error:', error);
    
    // Log OpenAI service as DOWN
    updateServiceStatus('OpenAI API', 'down', 0);
    
    // Log the failed request
    const duration = Date.now() - startTime;
    logRequest('/api/reflect', 'POST', 500, duration, ip);
    
    return NextResponse.json(
      { error: 'Failed to generate reflection' },
      { status: 500 }
    );
  }
}