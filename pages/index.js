import Head from 'next/head'
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
    if (!confirm("Tem certeza que deseja marcar este item como comprado?")) return

    try {
      // Atualiza o presente
      const res = await fetch('/api/gifts/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comprado: true }),
      })
      if (!res.ok) throw new Error("Erro ao marcar presente")
      const updatedGift = await res.json()
      setGifts(prev => prev.map(g => g.id === id ? updatedGift : g))

      alert("Presente marcado como comprado!")
    } catch (err) {
      console.error(err)
      alert("Ocorreu um erro: " + err.message)
    }
  }

 return (
  <>
    <Head>
      <title>Giovane e Thiago</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Ephesis&display=swap" rel="stylesheet" />
    </Head>

    <Header />

    <main style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <div className="openning">
        <img src="/images/holy-ring.png" alt="Fundo" />
        <div className="text-overlay">
          <h1>Giovane <br />&<br /> Thiago</h1>
        </div>
      </div>

      <ul className="gift-list">
        {gifts.map((g, index) => (
          index === 0 ? (
            <li key={g.id} className="pix-item">
              <div className="pix-content">
                <img src={g.image} alt={g.name} className="pix-image" />
                <div className="pix-text">
                  <h3 style={{ textAlign: 'center' }}>
                    Pix!!! (Para facilitar a vida de todos)
                  </h3>
                  <p className="main-text">
                    Sabemos que é muito em cima da hora para que possamos criar um presente super divertido
                    (Nem mesmo os noivos conseguiram pensar na lista de presente completa), e por esse motivo
                    achamos que seria melhor para todo mundo a opção do pix. Isso permite que nós mesmos
                    possamos pensar com cuidado no que precisamos e queremos, então estamos disponibilisando
                    o QRCode e a chave:
                  </p>
                  <p style={{ fontWeight: 'bold' }}>Pix: gm.massucci@gmail.com</p>
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
                <a
                  href={g.link}
                  target="_blank"
                  rel="noreferrer"
                  className="gift-link"
                >
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