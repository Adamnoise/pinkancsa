import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  provider: 'groq' | 'openai';
  componentName: string;
  requirements: string;
  framework?: string;
  styling?: string;
  complexity?: 'low' | 'medium' | 'high';
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    
    const { provider, componentName, requirements, framework = 'react', styling = 'tailwind' } = body;

    if (!componentName || !requirements) {
      return NextResponse.json(
        { error: 'Component name and requirements are required' },
        { status: 400 }
      );
    }

    // Validate component name (should be PascalCase)
    const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
    let validComponentName = componentName;
    
    if (!pascalCaseRegex.test(componentName)) {
      // Auto-convert to PascalCase
      validComponentName = componentName
        .split(/[\s\-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    }

    const systemPrompt = `You are an expert React developer. Generate a high-quality, production-ready React component with the following specifications:

Framework: ${framework}
Styling: ${styling}
Component Name: ${validComponentName}

Requirements:
- Use TypeScript
- Include proper prop types/interfaces
- Add accessibility attributes (ARIA labels, semantic HTML)
- Use modern React patterns (hooks, functional components)
- Include hover effects and smooth animations
- Make it responsive
- Follow best practices for ${styling}
- Add JSDoc comments for props and main functions
- Include error handling where appropriate

Generate ONLY the component code, no explanations or markdown formatting.`;

    const userPrompt = `Create a React component called "${validComponentName}" with these requirements:

${requirements}

Additional preferences:
- Framework: ${framework}
- Styling: ${styling}
- Make it modern and accessible
- Include smooth animations and hover effects
- Ensure responsive design`;

    let generatedCode = '';
    let usedProvider = provider;
    let error = null;

    // Try to generate with selected provider first
    try {
      if (provider === 'openai') {
        generatedCode = await generateWithOpenAI(systemPrompt, userPrompt);
      } else if (provider === 'groq') {
        generatedCode = await generateWithGroq(systemPrompt, userPrompt);
      }
    } catch (primaryError) {
      console.warn(`Primary provider (${provider}) failed:`, primaryError);
      error = primaryError;
      
      // Fallback to other provider
      try {
        if (provider === 'openai') {
          console.log('Falling back to Groq...');
          generatedCode = await generateWithGroq(systemPrompt, userPrompt);
          usedProvider = 'groq';
        } else {
          console.log('Falling back to OpenAI...');
          generatedCode = await generateWithOpenAI(systemPrompt, userPrompt);
          usedProvider = 'openai';
        }
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        throw fallbackError;
      }
    }

    if (!generatedCode) {
      throw new Error('No code generated');
    }

    return NextResponse.json({
      success: true,
      code: generatedCode,
      componentName: validComponentName,
      provider: usedProvider,
      fallbackUsed: usedProvider !== provider,
      metadata: {
        framework,
        styling,
        generatedAt: new Date().toISOString(),
        originalName: componentName !== validComponentName ? componentName : undefined
      }
    });

  } catch (error) {
    console.error('Code generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate component',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function generateWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generatedCode = data.choices?.[0]?.message?.content;

  if (!generatedCode) {
    throw new Error('No content generated by OpenAI');
  }

  return generatedCode.trim();
}

async function generateWithGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generatedCode = data.choices?.[0]?.message?.content;

  if (!generatedCode) {
    throw new Error('No content generated by Groq');
  }

  return generatedCode.trim();
}