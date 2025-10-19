import fs from "fs-extra";
import { randomUUID } from "crypto";

const dataPath = "./server/db/data.json";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const body = method !== "GET" ? await readBody(event) : null;
  const data = await fs.readJson(dataPath);

  switch (method) {
    case "GET":
      return data.sections;

    case "POST":
      const newSection = {
        id: randomUUID(),
        title: body.title,
        icon: body.icon || undefined,
        links: [],
        widgets: []
      };
      data.sections.push(newSection);
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return newSection;

    case "PUT":
      const { id, title, icon } = body;
      const sIndex = data.sections.findIndex((s) => s.id === id);
      if (sIndex === -1)
        throw createError({
          statusCode: 404,
          statusMessage: "Section not found",
        });
      data.sections[sIndex].title = title;
      if (icon !== undefined) {
        data.sections[sIndex].icon = icon;
      }
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return data.sections[sIndex];

    case "DELETE":
      const sectionId = getQuery(event).id as string;
      data.sections = data.sections.filter((s) => s.id !== sectionId);
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return { success: true };

    case "PATCH": // réorganisation
      const { order } = body; // liste d'IDs triés
      data.sections.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return { success: true };

    default:
      throw createError({
        statusCode: 405,
        statusMessage: "Method not allowed",
      });
  }
});
