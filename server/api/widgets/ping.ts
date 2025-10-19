export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url } = body;

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: "URL is required",
    });
  }

  try {
    // Faire une requête HEAD pour vérifier si le site répond
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 secondes

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Si le statut est 2xx ou 3xx, considérer comme en ligne
    const online = response.status >= 200 && response.status < 400;

    return {
      online,
      status: response.status,
    };
  } catch (e) {
    // En cas d'erreur (timeout, réseau, etc.), considérer comme hors ligne
    return {
      online: false,
      error: (e as Error).message,
    };
  }
});
