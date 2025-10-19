export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body;

  // Utiliser la variable d'environnement pour le mot de passe admin
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";

  if (password === adminPassword) {
    return { success: true };
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Invalid password",
  });
});
