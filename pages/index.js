import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  const [gifts, setGifts] = useState([])
  const [previewUrl, setPreviewUrl] = useState('') // link de preview do email

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

  // Marca presente como comprado e envia e-mail
  async function markBought(id) {
    const email = prompt("Digite seu e-mail para confirmar a compra:")
    if (!email) return alert("E-mail obrigatório!")

    if (!confirm("Tem certeza que deseja marcar este item como comprado?")) return

    try {
      // Atualiza o presente
      const res = await fetch('/api/gifts/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comprado: true, email }), // envia email no body
      })
      if (!res.ok) throw new Error("Erro ao marcar presente")
      const updatedGift = await res.json()
      setGifts(prev => prev.map(g => g.id === id ? updatedGift : g))

      // Envia o e-mail de confirmação
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, gift: updatedGift }),
      })
      if (!emailRes.ok) throw new Error("Erro ao enviar email")
      const { previewUrl } = await emailRes.json()
      setPreviewUrl(previewUrl) // salva o link de preview

      alert("Presente marcado como comprado! Confirmação enviada por e-mail.")
    } catch (err) {
      console.error(err)
      alert("Ocorreu um erro: " + err.message)
    }
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        <h1>Lista de Presentes</h1>
        <p>Escolha um presente e siga o link externo para comprar. Depois marque como "Já comprei".</p>

        {previewUrl && (
          <p>
            Email de teste enviado! Veja aqui: <a href={previewUrl} target="_blank" rel="noreferrer">{previewUrl}</a>
          </p>
        )}

        <ul className="gift-list">
          {gifts.map((g, index) => (
            index === 0 ? (
              <li key={g.id} className="pix-item">
                <div className="pix-content">
                  <img src={g.image} alt={g.name} className="pix-image" />
                  <div className="pix-text">
                    <h3 style={{ textAlign: 'center' }}>Pix!!! (Para facilitar a vida de todos)</h3>
                    <p className="main-text">
                      Sabemos que é muito em cima da hora para que possamos criar um presente super divertido
                      (Nem mesmo os noivos conseguiram pensar na lista de presente completa), e por esse motivo
                      achamos que seria melhor para todo mundo a opção do pix. Isso permite que nós mesmos
                      possamos pensar com cuidado no que precisamos e queremos, então estamos disponibilisando 
                      o QRCode e a chave:
                    </p>
                    <p style={{ fontWeight: 'bold' }}>gm.massucci@gmail.com</p>
                  </div>
                </div>
              </li>
            ) : (
              <li key={g.id} className={g.comprado ? 'comprado' : ''}>
                <div>
                  <img src={g.image} alt={g.name} className="gift-image" />
                  <h3>{g.name}</h3>
                </div>
                <div className="Links">
                  <a href={g.link} target="_blank" rel="noreferrer" className="gift-link">
                    Ir para o link
                  </a>
                  <button
                    className={`gift-button ${g.comprado ? 'desmarcar' : 'marcar'}`}
                    onClick={() => markBought(g.id)}
                    disabled={g.comprado}
                  >
                    {g.comprado ? 'Comprado' : 'Marcar como comprado'}
                  </button>
                </div>
              </li>
            )
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}