import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { fileKey: string } }
) {
  try {
    const { fileKey } = params
    
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

    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      )
    }

    console.log(`🔄 Fetching Figma file: ${fileKey}`)

    // Call Figma API
    const figmaResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': figmaToken,
        'Content-Type': 'application/json',
      },
    })

    if (!figmaResponse.ok) {
      const errorText = await figmaResponse.text()
      console.error(`❌ Figma API error: ${figmaResponse.status} - ${errorText}`)
      
      if (figmaResponse.status === 403) {
        return NextResponse.json(
          { error: 'Access denied. Please check your Figma token and file permissions.' },
          { status: 403 }
        )
      }
      
      if (figmaResponse.status === 404) {
        return NextResponse.json(
          { error: 'File not found. Please check the file key.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: `Figma API error: ${figmaResponse.status}` },
        { status: figmaResponse.status }
      )
    }

    const figmaData = await figmaResponse.json()

    // Transform the data into the expected format
    const nodes = extractNodes(figmaData.document)
    const components = Object.values(figmaData.components || {}).map((component: any) => ({
      key: component.key,
      name: component.name,
      description: component.description || '',
      componentSetId: component.componentSetId,
      documentationLinks: component.documentationLinks || [],
    }))

    console.log(`✅ Figma file fetched successfully: ${figmaData.name}`)

    return NextResponse.json({
      file: {
        name: figmaData.name,
        role: figmaData.role,
        lastModified: figmaData.lastModified,
        thumbnailUrl: figmaData.thumbnailUrl,
        version: figmaData.version,
        document: figmaData.document,
        components: figmaData.components,
        componentSets: figmaData.componentSets,
        schemaVersion: figmaData.schemaVersion,
        styles: figmaData.styles,
      },
      nodes,
      components,
    })

  } catch (error) {
    console.error('❌ Error in Figma API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function extractNodes(document: any): any[] {
  const nodes: any[] = []
  
  function traverse(node: any) {
    if (node.type === 'COMPONENT' || node.type === 'FRAME' || node.type === 'INSTANCE') {
      nodes.push({
        id: node.id,
        name: node.name,
        type: node.type,
        absoluteBoundingBox: node.absoluteBoundingBox,
        constraints: node.constraints,
        layoutMode: node.layoutMode,
        primaryAxisSizingMode: node.primaryAxisSizingMode,
        counterAxisSizingMode: node.counterAxisSizingMode,
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight,
        paddingTop: node.paddingTop,
        paddingBottom: node.paddingBottom,
        itemSpacing: node.itemSpacing,
        backgroundColor: node.backgroundColor,
        cornerRadius: node.cornerRadius,
        fills: node.fills,
        strokes: node.strokes,
        effects: node.effects,
        characters: node.characters,
        style: node.style,
        children: node.children,
      })
    }
    
    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  
  if (document.children) {
    document.children.forEach(traverse)
  }
  
  return nodes
}