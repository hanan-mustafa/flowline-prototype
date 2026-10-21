import { Outlet } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Timeline from '../components/Timeline'

export default function Shell() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar />
      <main className="flex-1 pb-44">
        <Outlet />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20">
        <Timeline />
      </div>
    </div>
  )
}
