import fs from 'fs-extra'
const dataPath = './server/db/data.json'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const data = await fs.readJson(dataPath)
    return data.settings
  }

  if (event.node.req.method === 'PUT') {
    const body = await readBody(event)
    const data = await fs.readJson(dataPath)
    data.settings = body
    await fs.writeJson(dataPath, data, { spaces: 2 })
    return { success: true }
  }
})
