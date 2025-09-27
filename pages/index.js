import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  const [gifts, setGifts] = useState([])

  // Busca e atualiza a lista a cada 5s
  useEffect(() => {
    async function fetchGifts() {
      const res = await fetch('/api/gifts')
      const data = await res.json()
      setGifts(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
    }

    fetchGifts()
    const interval = setInterval(fetchGifts, 5000)
    return () => clearInterval(interval)
  }, [])

  // Marca presente como comprado
  async function markBought(id) {
    const email = prompt("Digite seu e-mail para confirmar a compra:")
    if (!email) return alert("E-mail obrigatório!")

    if (!confirm("Tem certeza que deseja marcar este item como comprado?")) return

    try {
      const res = await fetch('/api/gifts/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comprado: true, email }),
      })
      if (!res.ok) throw new Error("Erro ao marcar presente")

      const updatedGift = await res.json()
      setGifts(prev => prev.map(g => g.id === id ? updatedGift : g))
      alert("Presente marcado como comprado! Confirmação enviada por e-mail.")
    } catch (err) {
      console.error(err)
      alert("Ocorreu um erro ao marcar o presente.")
    }
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        <h1>Lista de Presentes</h1>
        <p>Escolha um presente e siga o link externo para comprar. Depois marque como "Já comprei".</p>
        <ul className="gift-list">
          {gifts.map(g => (
            <li key={g.id} className={g.comprado ? 'comprado' : ''}>
              <div>
                <img src={g.image} alt={g.name} className="gift-image" />
                <h3>{g.name}</h3>
                <a
  href={g.link}
  target="_blank"
  rel="noreferrer"
  className="gift-link"
>
  Ir para o link
</a>
              </div>
              <button
                className={`gift-button ${g.comprado ? 'desmarcar' : 'marcar'}`}
                onClick={() => markBought(g.id)}
                disabled={g.comprado}
              >
                {g.comprado ? 'Comprado' : 'Marcar como comprado'}
              </button>
            </li>
          ))}
        </ul>
        <footer style={{ marginTop: 24 }}>
          
        </footer>
      </main>
      <Footer />
    </>
  )
}