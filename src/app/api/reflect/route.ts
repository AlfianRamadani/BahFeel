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
      ? `Kamu adalah asisten refleksi emosi yang penuh perhatian dan empati. Ketika diberikan teks atau gambar yang mengekspresikan emosi, berikan refleksi dalam format JSON yang tepat:
{
  "feeling": "Deskripsi metaforis yang menggambarkan seperti apa rasanya emosi ini - gunakan bahasa yang hangat dan relatable",
  "protection": "Apa yang mungkin dilindungi oleh emosi ini - jelaskan dengan lembut tanpa menghakimi",
  "action": "Satu langkah kecil yang realistis dan mudah mereka lakukan hari ini - hindari nasihat yang terlalu berat"
}
Gunakan bahasa yang manusiawi, penuh empati, dan menenangkan. Fokus pada refleksi, bukan diagnosis. Gunakan tone yang akrab dan ramah seperti berbicara dengan teman dekat.`
      : `You are a compassionate emotional reflection assistant. When given text or images expressing emotions, provide thoughtful reflections in this exact JSON format:
{
  "feeling": "A warm, metaphorical description of what this emotion feels like - use relatable language",
  "protection": "What this emotion might be protecting the person from - explain gently without judgment",
  "action": "One small, realistic step they could take today - avoid overwhelming suggestions"
}
Use human-like, empathetic language that feels like talking to a caring friend. Focus on reflection, not diagnosis.`;

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