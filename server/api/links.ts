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
      const { sectionId, label, url, icon } = body;
      const section = data.sections.find((s) => s.id === sectionId);
      if (!section)
        throw createError({
          statusCode: 404,
          statusMessage: "Section not found",
        });

      const newLink = { id: randomUUID(), label, url, icon };
      section.links.push(newLink);
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return newLink;

    case "PUT":
      const { id, ...update } = body;
      let updated = null;
      for (const section of data.sections) {
        const link = section.links.find((l) => l.id === id);
        if (link) {
          Object.assign(link, update);
          updated = link;
          break;
        }
      }
      if (!updated)
        throw createError({ statusCode: 404, statusMessage: "Link not found" });
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return updated;

    case "PATCH":
      const { sectionId: sid, order: linkOrder } = body;
      const sec = data.sections.find((s) => s.id === sid);
      if (!sec)
        throw createError({
          statusCode: 404,
          statusMessage: "Section not found",
        });
      sec.links.sort(
        (a, b) => linkOrder.indexOf(a.id) - linkOrder.indexOf(b.id)
      );
      await fs.writeJson(dataPath, data, { spaces: 2 });
      return { success: true };

    case "DELETE":
      const linkId = getQuery(event).id as string;
      for (const section of data.sections) {
        section.links = section.links.filter((l) => l.id !== linkId);
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
