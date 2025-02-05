"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Brain,
  Home,
  Layout,
  Plus,
  Settings,
} from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'My Classes', href: '/classes', icon: BookOpen },
    { name: 'Test Generator', href: '/tests', icon: Brain },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div
      className={cn(
        'flex flex-col h-screen border-r bg-background',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed && (
          <span className="text-xl font-bold">Teach-me</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Layout className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-2 py-2 text-sm font-medium rounded-md',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <Button className="w-full" size={isCollapsed ? 'icon' : 'default'}>
          <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
          {!isCollapsed && 'New Class'}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar