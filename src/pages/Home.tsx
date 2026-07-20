import Hero from '../components/Hero'
import Content from '../components/Content'

export default function Home() {
  return (
    <main className="min-h-screen font-manrope bg-white text-black overflow-x-clip max-w-[100vw]">
      <Hero />
      <Content />
    </main>
  )
}
