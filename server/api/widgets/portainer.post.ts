import { fetch as undiciFetch, Agent } from 'undici'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { apiUrl, apiToken, endpoint } = body

  if (!apiUrl || !endpoint) {
    throw createError({
      statusCode: 400,
      statusMessage: 'apiUrl et endpoint sont requis'
    })
  }

  const fullUrl = `${apiUrl}${endpoint}`

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    }

    if (apiToken) {
      headers['X-API-Key'] = apiToken
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
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Erreur lors de la communication avec Portainer'
    })
  }
})
