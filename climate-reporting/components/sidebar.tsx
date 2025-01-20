import Link from 'next/link'
import { Home, Database, GitFork } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#455a64]">Climate Reporting</h1>
      </div>
      <nav className="space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-[#455a64] hover:bg-[#ccebee] rounded-md"
        >
          <Home className="w-5 h-5" />
          Home
        </Link>
        <Link
          href="/data-sources"
          className="flex items-center gap-3 px-3 py-2 text-[#455a64] hover:bg-[#ccebee] rounded-md"
        >
          <Database className="w-5 h-5" />
          Data sources
        </Link>
        <Link
          href="/account-mapping"
          className="flex items-center gap-3 px-3 py-2 text-[#455a64] hover:bg-[#ccebee] rounded-md"
        >
          <GitFork className="w-5 h-5" />
          Account mapping
        </Link>
      </nav>
    </div>
  )
}

