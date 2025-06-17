// services/figma-api-service.ts
export interface FigmaNode {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
  fills?: any[]
  strokes?: any[]
  effects?: any[]
  absoluteBoundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  constraints?: any
  layoutMode?: string
  primaryAxisSizingMode?: string
  counterAxisSizingMode?: string
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  itemSpacing?: number
  backgroundColor?: any
  cornerRadius?: number
  characters?: string
  style?: any
}

export interface FigmaComponent {
  key: string
  name: string
  description: string
  componentSetId?: string
  documentationLinks: any[]
}

export interface FigmaFileResponse {
  name: string
  role: string
  lastModified: string
  thumbnailUrl: string
  version: string
  document: any
  components: Record<string, any>
  componentSets: Record<string, any>
  schemaVersion: number
  styles: Record<string, any>
}

export class FigmaApiService {
  static async fetchFileData(fileKey: string): Promise<{
    file: FigmaFileResponse
    nodes: FigmaNode[]
    components: FigmaComponent[]
  }> {
    try {
      // Call your API route instead of Figma API directly
      const response = await fetch(`/api/figma/file/${fileKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      console.log("✅ Figma file data fetched:", {
        name: data.file.name,
        nodeCount: data.nodes.length,
        componentCount: data.components.length,
      })

      return data
    } catch (error) {
      console.error("❌ Error fetching Figma file data:", error)
      throw error
    }
  }

  static async fetchNodeImages(fileKey: string, nodeIds: string[]): Promise<Record<string, string>> {
    try {
      const response = await fetch(`/api/figma/images/${fileKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeIds }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      return data.images || {}
    } catch (error) {
      console.error("❌ Error fetching node images:", error)
      return {}
    }
  }

  static generateCSS(nodes: FigmaNode[]): string {
    let css = "/* Generated from Figma */\n\n"

    for (const node of nodes) {
      if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") {
        css += this.generateNodeCSS(node)
      }
    }

    return css
  }

  private static generateNodeCSS(node: FigmaNode): string {
    const className = this.sanitizeClassName(node.name)
    let css = `.${className} {\n`

    // Layout properties
    if (node.absoluteBoundingBox) {
      css += `  width: ${node.absoluteBoundingBox.width}px;\n`
      css += `  height: ${node.absoluteBoundingBox.height}px;\n`
    }

    // Layout mode (Flexbox)
    if (node.layoutMode === "HORIZONTAL") {
      css += `  display: flex;\n`
      css += `  flex-direction: row;\n`
    } else if (node.layoutMode === "VERTICAL") {
      css += `  display: flex;\n`
      css += `  flex-direction: column;\n`
    }

    // Padding
    if (node.paddingLeft || node.paddingRight || node.paddingTop || node.paddingBottom) {
      css += `  padding: ${node.paddingTop || 0}px ${node.paddingRight || 0}px ${node.paddingBottom || 0}px ${node.paddingLeft || 0}px;\n`
    }

    // Gap
    if (node.itemSpacing) {
      css += `  gap: ${node.itemSpacing}px;\n`
    }

    // Background
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0]
      if (fill.type === "SOLID") {
        const { r, g, b, a = 1 } = fill.color
        css += `  background-color: rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a});\n`
      }
    }

    // Border radius
    if (node.cornerRadius) {
      css += `  border-radius: ${node.cornerRadius}px;\n`
    }

    css += "}\n\n"
    return css
  }

  private static sanitizeClassName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }
}