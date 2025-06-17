interface GroqConfig {
  apiKey: string
  baseURL: string
  model: string
}

export const groqModels = [
  {
    id: "llama-3.1-70b-versatile",
    name: "Llama 3.1 70B",
    description: "Most capable model, best for complex tasks",
    contextLength: 131072,
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    description: "Faster model, good for simple tasks",
    contextLength: 131072,
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Good balance of speed and capability",
    contextLength: 32768,
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Google's efficient model",
    contextLength: 8192,
  },
]

export class GroqClient {
  private config: GroqConfig

  constructor(apiKey?: string) {
    const clientSideApiKey =
      typeof window !== "undefined" ? localStorage.getItem("groq_api_key") : null

    this.config = {
      apiKey:
        apiKey ||
        process.env.NEXT_PUBLIC_GROQ_API_KEY ||
        clientSideApiKey ||
        "",
      baseURL: "https://api.groq.com/openai/v1",
      model: "llama-3.1-70b-versatile",
    }
  }

  async generateText(
    prompt: string,
    options: {
      model?: string
      maxTokens?: number
      temperature?: number
      stream?: boolean
    } = {},
  ): Promise<string> {
    if (!this.config.apiKey || this.config.apiKey.trim() === "") {
      throw new Error("Groq API key not found. Please set NEXT_PUBLIC_GROQ_API_KEY environment variable or add your API key in the settings.")
    }

    if (options.stream) {
      throw new Error("Streaming is not yet supported in this implementation.")
    }

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || this.config.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.2,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(`Groq API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ""
  }

  async generateObject<T>(
    prompt: string,
    schema: any,
    options: {
      model?: string
      temperature?: number
    } = {},
  ): Promise<T> {
    const enhancedPrompt = `${prompt}

Please respond with valid JSON that matches this schema. Only return the JSON, no additional text:

${JSON.stringify(schema, null, 2)}`

    const response = await this.generateText(enhancedPrompt, {
      ...options,
      temperature: options.temperature || 0.1,
    })

    try {
      return JSON.parse(response) as T
    } catch (error) {
      console.error("❌ Failed to parse Groq response:", response)
      throw new Error(`Failed to parse JSON response: ${error}`)
    }
  }

  static getAvailableModels() {
    return groqModels
  }
}

export const validateGroqKey = (key: string): boolean => {
  return key.startsWith("gsk_") && key.length > 20
}

export const testGroqConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const client = new GroqClient(apiKey)
    const response = await client.generateText('Say "Hello" if you can hear me.', {
      maxTokens: 10,
    })
    return response.toLowerCase().includes("hello")
  } catch (error) {
    console.error("Groq connection test failed:", error)
    return false
  }
}
