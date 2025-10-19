import { fetch as undiciFetch, Agent } from 'undici'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { apiUrl, slug } = body

  if (!apiUrl || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'apiUrl et slug sont requis'
    })
  }

  const fullUrl = `${apiUrl}/api/status-page/${slug}`

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    }

    const dispatcher = new Agent({
      connect: {
        rejectUnauthorized: false
      }
    })

    const response = await undiciFetch(fullUrl, {
      method: 'GET',
      headers,
      dispatcher
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Erreur Uptime Kuma API:', {
      url: fullUrl,
      status: error.statusCode,
      message: error.message,
      data: error.data
    })

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la communication avec Uptime Kuma'
    })
  }
})
