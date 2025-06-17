import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { fileKey: string } }
) {
  try {
    const { fileKey } = params
    const body = await request.json()
    const { nodeIds } = body
    
    // Get the Figma access token from headers or environment
    const figmaToken = request.headers.get('x-figma-token') || 
                      request.headers.get('authorization')?.replace('Bearer ', '') ||
                      process.env.FIGMA_ACCESS_TOKEN
    
    if (!figmaToken) {
      return NextResponse.json(
        { error: 'Figma access token is required' },
        { status: 401 }
      )
    }

    if (!fileKey || !nodeIds || !Array.isArray(nodeIds)) {
      return NextResponse.json(
        { error: 'File key and node IDs are required' },
        { status: 400 }
      )
    }

    console.log(`🔄 Fetching node images for file: ${fileKey}`)

    // Build the API URL with query parameters
    const nodeIdsParam = nodeIds.join(',')
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeIdsParam}&format=png&scale=1`

    // Call Figma API
    const figmaResponse = await fetch(url, {
      headers: {
        'X-Figma-Token': figmaToken,
        'Content-Type': 'application/json',
      },
    })

    if (!figmaResponse.ok) {
      const errorText = await figmaResponse.text()
      console.error(`❌ Figma Images API error: ${figmaResponse.status} - ${errorText}`)
      
      if (figmaResponse.status === 403) {
        return NextResponse.json(
          { error: 'Access denied. Please check your Figma token and file permissions.' },
          { status: 403 }
        )
      }
      
      if (figmaResponse.status === 404) {
        return NextResponse.json(
          { error: 'File or nodes not found. Please check the file key and node IDs.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: `Figma API error: ${figmaResponse.status}` },
        { status: figmaResponse.status }
      )
    }

    const figmaData = await figmaResponse.json()

    console.log(`✅ Node images fetched successfully for ${nodeIds.length} nodes`)

    return NextResponse.json({
      images: figmaData.images || {},
      err: figmaData.err || null,
    })

  } catch (error) {
    console.error('❌ Error in Figma Images API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}