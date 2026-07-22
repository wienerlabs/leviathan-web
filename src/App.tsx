import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Seo from './components/Seo'
import { DOCS_DEFAULT } from './docs/nav'
import { ThemeProvider } from './theme/ThemeProvider'

const GetLevi = lazy(() => import('./pages/GetLevi'))
const DocsLayout = lazy(() => import('./docs/DocsLayout'))
const BlogIndex = lazy(() => import('./blog/BlogIndex'))
const BlogPost = lazy(() => import('./blog/BlogPost'))

function RouteFallback() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-black/20 border-t-black animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Seo />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-levi" element={<GetLevi />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/docs" element={<Navigate to={DOCS_DEFAULT} replace />} />
            <Route path="/docs/*" element={<DocsLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}
