import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import GetLevi from './pages/GetLevi'
import DocsLayout from './docs/DocsLayout'
import BlogIndex from './blog/BlogIndex'
import BlogPost from './blog/BlogPost'
import Seo from './components/Seo'
import { DOCS_DEFAULT } from './docs/nav'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Seo />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-levi" element={<GetLevi />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/docs" element={<Navigate to={DOCS_DEFAULT} replace />} />
          <Route path="/docs/*" element={<DocsLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
