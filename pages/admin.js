import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Admin() {
  const [gifts, setGifts] = useState([])
  const [form, setForm] = useState({ name: '', link: '', image: '/images/towels.jpg' })
  const [editGift, setEditGift] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/gifts')
      .then(r => r.json())
      .then(setGifts)
  }, [])

  async function add() {
    const newGiftData = { ...form, order: gifts.length + 1 }
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGiftData)
      })
      const newGift = await res.json()
      setGifts(prev => [...prev, newGift])
      setForm({ name: '', link: '', image: '/images/towels.jpg' })
    } catch (err) {
      console.error(err)
      alert("Erro ao adicionar presente")
    }
  }

  async function remove(id) {
    await fetch('/api/gifts/' + id, { method: 'DELETE' })
    setGifts(prev => prev.filter(g => g.id !== id))
  }

  async function toggle(id) {
    const email = prompt("Digite seu e-mail para confirmar a compra:")
    if (!email) return alert("E-mail obrigatório!")
    if (!confirm("Tem certeza que deseja marcar como comprado?")) return

    const gift = gifts.find(g => g.id === id)
    try {
      const res = await fetch('/api/gifts/' + id, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ comprado: !gift.comprado, email })
      })
      if (!res.ok) throw new Error("Erro ao atualizar presente")

      setGifts(prev => prev.map(g => g.id === id ? { ...g, comprado: !g.comprado } : g))
      alert("Presente atualizado com sucesso!")
    } catch (err) {
      console.error(err)
      alert("Erro ao marcar comprado")
    }
  }

  function move(index, direction) {
    const newGifts = [...gifts]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= gifts.length) return

    [newGifts[index], newGifts[targetIndex]] = [newGifts[targetIndex], newGifts[index]]
    const updated = newGifts.map((g, i) => ({ ...g, order: i + 1 }))
    setGifts(updated)

    fetch('/api/gifts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
  }

  async function saveEdit() {
    try {
      if (!editGift?.id) {
        alert("Erro: presente sem ID para editar")
        return
      }
      const res = await fetch('/api/gifts/' + editGift.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editGift)
      })
      if (!res.ok) throw new Error(await res.text())
      const updated = await res.json()
      setGifts(prev => prev.map(g => g.id === editGift.id ? updated : g))
      setEditGift(null)
    } catch (err) {
      console.error("Erro ao salvar edição:", err)
      alert("Erro ao salvar edição: " + err.message)
    }
  }

  return (
    <>
      <Header />
      <main style={{ fontFamily: 'Arial, sans-serif', padding: 20, maxWidth: 900, margin: '0 auto' }}>
        <h1>Admin - Lista de Presentes</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, alignItems: 'start' }}>
          <div>
            <h2>Presentes</h2>
            <ul style={{ padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
              {gifts.map((g, i) => (
                <li key={g.id} style={{ border: '1px solid #ddd', padding: 10, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{g.name}</strong><br />
                    <small>{g.link}</small>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => toggle(g.id)}>{g.comprado ? 'Desmarcar' : 'Marcar comprado'}</button>
                    <button onClick={() => remove(g.id)}>Remover</button>
                    <button onClick={() => move(i, -1)}>↑</button>
                    <button onClick={() => move(i, 1)}>↓</button>
                    <button onClick={() => setEditGift(g)}>Editar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside>
            <h2>Adicionar presente</h2>
            <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <input placeholder="Link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <input placeholder="Imagem (caminho público)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <button onClick={add} style={{ width: '100%' }}>Adicionar</button>
          </aside>
        </div>

        <p style={{ marginTop: 20 }}>
          <button onClick={() => router.push('/')} style={{ cursor: 'pointer', padding: '6px 12px' }}>
            Voltar para a lista pública
          </button>
        </p>

        {editGift && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 300, zIndex: 1001 }}>
              <h3>Editar presente</h3>
              <input value={editGift.name} onChange={e => setEditGift({ ...editGift, name: e.target.value })} /><br />
              <input value={editGift.link} onChange={e => setEditGift({ ...editGift, link: e.target.value })} /><br />
              <input value={editGift.image} onChange={e => setEditGift({ ...editGift, image: e.target.value })} /><br />
              <button onClick={saveEdit}>Salvar</button>
              <button onClick={() => setEditGift(null)}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}