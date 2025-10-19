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
      const { sectionId, name, props } = body;
      const section = data.sections.find((s) => s.id === sectionId);
      if (!section)
        throw createError({
          statusCode: 404,
          statusMessage: "Section not found",
        });

      const newWidget = { id: randomUUID(), name, props };
      if (!section.widgets) section.widgets = [];
      section.widgets.push(newWidget);
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return newWidget;

    case "DELETE":
      const widgetId = getQuery(event).id as string;
      for (const section of data.sections) {
        if (section.widgets) {
          section.widgets = section.widgets.filter((w) => w.id !== widgetId);
        }
      }
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return { success: true };

    default:
      throw createError({
        statusCode: 405,
        statusMessage: "Method not allowed",
      });
  }
});
