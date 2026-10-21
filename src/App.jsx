import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoryProvider } from './state/story'
import Landing from './views/Landing'
import Shell from './views/Shell'
import RoleView from './views/RoleView'

export default function App() {
  return (
    <StoryProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Shell />}>
            <Route path="/owner" element={<RoleView roleId="owner" />} />
            <Route path="/engineer" element={<RoleView roleId="engineer" />} />
            <Route path="/l1" element={<RoleView roleId="l1" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoryProvider>
  )
}
