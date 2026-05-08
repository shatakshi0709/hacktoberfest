import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { MobileSidebar } from '../components/MobileSidebar'
import { ChatWidget } from '../chatbot/ChatWidget'

export function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 pb-10 pt-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>
        <MobileSidebar />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  )
}

