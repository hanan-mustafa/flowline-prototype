import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoryProvider } from './state/story'
import Landing from './views/Landing'
import Shell from './views/Shell'
import EngineerView from './views/engineer/EngineerView'
import Page from './views/engineer/Page'
import CaseFile from './views/engineer/CaseFile'
import FixOptions from './views/engineer/FixOptions'
import SignOff from './views/engineer/SignOff'
import L1View from './views/l1/L1View'
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
            <Route path="/engineer" element={<EngineerView />}>
              <Route index element={<Page />} />
              <Route path="case" element={<CaseFile />} />
              <Route path="fix" element={<FixOptions />} />
              <Route path="signoff" element={<SignOff />} />
            </Route>
            <Route path="/l1" element={<L1View />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoryProvider>
  )
}
