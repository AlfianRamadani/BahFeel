import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { type, content } = await request.json();

    let messages: any[] = [];

    if (type === 'text') {
      messages = [
        {
          role: 'system',
          content: `You are a compassionate emotional reflection assistant. When given text expressing emotions, provide a reflection in this exact JSON format:
{
  "feeling": "A metaphorical description of what the emotion feels like",
  "protection": "What this emotion might be protecting the person from",
  "action": "One gentle, realistic step they could take"
}
Use human-like, empathetic language. Focus on reflection, not diagnosis.`
        },
        {
          role: 'user',
          content: content
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
      
      const textContent = descriptionText 
        ? `The user provided this description about the image: "${descriptionText}"\n\nPlease analyze both the image and this description to provide emotional reflection.`
        : 'Analyze this image for emotional expression:';
      
      messages = [
        {
          role: 'system',
          content: `You are a compassionate emotional reflection assistant. When given an image and/or description expressing emotions, analyze it and provide a reflection in this exact JSON format:
{
  "feeling": "A metaphorical description of what the emotion in the image/description feels like",
  "protection": "What this emotion might be protecting the person from",
  "action": "One gentle, realistic step they could take"
}
Use human-like, empathetic language. Focus on reflection, not diagnosis.`
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const reflection = JSON.parse(response);

    return NextResponse.json(reflection);
  } catch (error) {
    console.error('AI reflection error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reflection' },
      { status: 500 }
    );
  }
}