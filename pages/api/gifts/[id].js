import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'gifts.json')

function readGifts() {
  const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '[]'
  return JSON.parse(data)
}

function writeGifts(gifts) {
  fs.writeFileSync(filePath, JSON.stringify(gifts, null, 2))
}

export default async function handler(req, res) {
  const { id } = req.query
  const gifts = readGifts()
  const index = gifts.findIndex(g => g.id.toString() === id.toString())

  if (index === -1) {
    return res.status(404).json({ error: 'Presente não encontrado' })
  }

  if (req.method === 'PUT') {
    // Atualiza o presente
    gifts[index] = { ...gifts[index], ...req.body }
    writeGifts(gifts)

    // Envia e-mail se for marcação de compra
    if (req.body.email && req.body.comprado) {
      try {
        await sendConfirmationEmail(req.body.email, gifts[index])
      } catch (err) {
        console.error('Erro ao enviar email:', err)
        return res.status(500).json({ error: 'Erro ao enviar email' })
      }
    }

    return res.status(200).json(gifts[index])
  }

  if (req.method === 'DELETE') {
    const deleted = gifts.splice(index, 1)
    writeGifts(gifts)
    return res.status(200).json(deleted[0])
  }

  if (req.method === 'GET') {
    return res.status(200).json(gifts[index])
  }

  res.status(405).json({ error: 'Método não permitido' })
}