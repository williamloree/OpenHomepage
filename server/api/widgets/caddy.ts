export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { apiUrl, endpoint } = body

  if (!apiUrl || !endpoint) {
    throw createError({
      statusCode: 400,
      statusMessage: 'apiUrl et endpoint sont requis'
    })
  }

  const fullUrl = `${apiUrl}${endpoint}`

  try {
    const response = await $fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    return {
      success: true,
      data: response
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur lors de la communication avec Caddy'
    })
  }
})