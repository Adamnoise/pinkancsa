import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');
    
    const response = await fetch('https://api.figma.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Figma-Token': token
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Figma API error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: `Figma API error: ${response.status}`,
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const userData = await response.json();
    
    return NextResponse.json({
      ...userData,
      connectionStatus: 'connected',
      apiVersion: 'v1',
      lastConnected: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.figma.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Figma-Token': token
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      return NextResponse.json(
        { 
          error: `Token validation failed: ${response.status}`,
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const userData = await response.json();
    
    return NextResponse.json({
      valid: true,
      user: userData,
      connectionStatus: 'connected',
      validatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Token validation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Token validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}