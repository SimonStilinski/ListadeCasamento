import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const filePath = path.join(process.cwd(), 'data', 'gifts.json')

function readGifts() {
  const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '[]'
  return JSON.parse(data)
}

function writeGifts(gifts) {
  fs.writeFileSync(filePath, JSON.stringify(gifts, null, 2))
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const gifts = readGifts()
    return res.status(200).json(gifts)
  }

  if (req.method === 'POST') {
  const newGift = {
    ...req.body,
    id: Date.now().toString() // garante ID único
  }

  gifts.push(newGift)
  fs.writeFileSync(file, JSON.stringify(gifts, null, 2))
  return res.status(201).json(newGift)
}

  if (req.method === 'PUT') {
    const updatedGifts = req.body
    writeGifts(updatedGifts)
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Método não permitido' })
}
