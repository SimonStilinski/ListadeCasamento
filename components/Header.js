import Link from "next/link"

export default function Header() {
  return (
    <header>
      <h1>🎁 Lista de Presentes</h1>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  )
}