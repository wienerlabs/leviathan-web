import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import GetLevi from './pages/GetLevi'
import DocsLayout from './docs/DocsLayout'
import { DOCS_DEFAULT } from './docs/nav'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-levi" element={<GetLevi />} />
        <Route path="/docs" element={<Navigate to={DOCS_DEFAULT} replace />} />
        <Route path="/docs/*" element={<DocsLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
