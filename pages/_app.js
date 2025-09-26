import React from 'react'          // <- ESSE IMPORT FALTAVA
import '../styles/globals.css'
export default function App({ Component, pageProps }) {
  return  (<React.StrictMode>
      <Component {...pageProps} />
    </React.StrictMode>)
}
