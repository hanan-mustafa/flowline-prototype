import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoryProvider } from './state/story'
import Landing from './views/Landing'
import Shell from './views/Shell'
import RoleView from './views/RoleView'
import OwnerView from './views/owner/OwnerView'
import FlowMap from './views/owner/FlowMap'
import Approval from './views/owner/Approval'
import Recovery from './views/owner/Recovery'
import Policy from './views/owner/Policy'

export default function App() {
  return (
    <StoryProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Shell />}>
            <Route path="/owner" element={<OwnerView />}>
              <Route index element={<FlowMap />} />
              <Route path="approval" element={<Approval />} />
              <Route path="recovery" element={<Recovery />} />
              <Route path="policy" element={<Policy />} />
            </Route>
            <Route path="/engineer" element={<RoleView roleId="engineer" />} />
            <Route path="/l1" element={<RoleView roleId="l1" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoryProvider>
  )
}
