import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import DateFilter, { getDateRange } from '../components/DateFilter'
import { 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2,
  Filter,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

function ApplicationRow({ app, expanded, onToggle }) {
  return (
    <div className={`border rounded-lg mb-2 overflow-hidden ${app.is_flagged ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      {/* Main Row */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-4"
        onClick={onToggle}
      >
        <div className="flex-shrink-0">
          {app.is_flagged ? (
            <AlertTriangle className="text-amber-500" size={20} />
          ) : (
            <CheckCircle2 className="text-emerald-500" size={20} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{app.company}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{app.job_title}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {app.client_name} • {format(new Date(app.date_applied), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
            {app.source}
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">Location</p>
              <p className="text-gray-900">{app.location || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">Salary</p>
              <p className="text-gray-900">{app.salary || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">Resume</p>
              <p className="text-gray-900">{app.resume_used || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">Specialist</p>
              <p className="text-gray-900">{app.specialist_name || '—'}</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {app.source_link && (
              <a 
                href={app.source_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-jw-600 hover:text-jw-700"
              >
                <ExternalLink size={14} />
                Source Link
              </a>
            )}
            {app.application_link && (
              <a 
                href={app.application_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-jw-600 hover:text-jw-700"
              >
                <ExternalLink size={14} />
                Application Link
              </a>
            )}
          </div>
          
          {app.is_flagged && app.flag_reason && (
            <div className="mt-4 p-3 bg-amber-100 rounded-lg">
              <p className="text-sm font-medium text-amber-800">⚠️ Flagged: {app.flag_reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Applications() {
  const { user, isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [dateRange, setDateRange] = useState('mtd')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [stats, setStats] = useState({ total: 0, flagged: 0, today: 0 })

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    if (clients.length > 0 || isAdmin) {
      loadApplications()
    }
  }, [selectedClient, dateRange, showFlaggedOnly, clients])

  async function loadClients() {
    try {
      if (isAdmin) {
        // Admin sees all clients (excluding demo)
        const { data } = await supabase
          .from('clients')
          .select('id, first_name, last_name')
          .eq('is_demo', false)
          .order('first_name')
        setClients(data || [])
      } else {
        // Specialist sees only assigned clients
        const { data: assignments } = await supabase
          .from('client_assignments')
          .select('client_id')
          .eq('specialist_id', user.id)
          .eq('is_active', true)

        if (assignments && assignments.length > 0) {
          const clientIds = assignments.map(a => a.client_id)
          const { data } = await supabase
            .from('clients')
            .select('id, first_name, last_name')
            .in('id', clientIds)
            .eq('is_demo', false)
            .order('first_name')
          setClients(data || [])
        }
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    }
  }

  async function loadApplications() {
    setLoading(true)
    
    try {
      const { start, end } = getDateRange(dateRange)
      const startStr = format(start, 'yyyy-MM-dd')
      const endStr = format(end, 'yyyy-MM-dd')

      // Build query
      let query = supabase
        .from('applications')
        .select('*')
        .eq('is_deleted', false)
        .gte('date_applied', startStr)
        .lte('date_applied', endStr)
        .order('date_applied', { ascending: false })
        .order('created_at', { ascending: false })

      // Filter by client if selected
      if (selectedClient) {
        query = query.eq('client_id', selectedClient)
      }

      // Filter by specialist if not admin
      if (!isAdmin) {
        query = query.eq('specialist_id', user.id)
      }

      // Filter flagged only
      if (showFlaggedOnly) {
        query = query.eq('is_flagged', true)
      }

      // Exclude demo data
      const { data: apps, error } = await query

      if (error) {
        console.error('Error loading applications:', error)
        setLoading(false)
        return
      }

      // Get client and specialist names
      const clientIds = [...new Set(apps?.map(a => a.client_id).filter(Boolean))]
      const specialistIds = [...new Set(apps?.map(a => a.specialist_id).filter(Boolean))]

      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, first_name, last_name, is_demo')
        .in('id', clientIds.length > 0 ? clientIds : ['00000000-0000-0000-0000-000000000000'])

      const { data: specialistsData } = await supabase
        .from('users')
        .select('id, name, is_demo')
        .in('id', specialistIds.length > 0 ? specialistIds : ['00000000-0000-0000-0000-000000000000'])

      const clientMap = {}
      clientsData?.forEach(c => {
        clientMap[c.id] = { name: `${c.first_name} ${c.last_name || ''}`.trim(), isDemo: c.is_demo }
      })

      const specialistMap = {}
      specialistsData?.forEach(s => {
        specialistMap[s.id] = { name: s.name, isDemo: s.is_demo }
      })

      // Filter out demo data and add names
      const enrichedApps = apps
        ?.filter(a => !clientMap[a.client_id]?.isDemo && !specialistMap[a.specialist_id]?.isDemo)
        .map(a => ({
          ...a,
          client_name: clientMap[a.client_id]?.name || 'Unknown',
          specialist_name: specialistMap[a.specialist_id]?.name || 'Unknown'
        }))

      setApplications(enrichedApps || [])

      // Calculate stats
      const today = format(new Date(), 'yyyy-MM-dd')
      setStats({
        total: enrichedApps?.length || 0,
        flagged: enrichedApps?.filter(a => a.is_flagged).length || 0,
        today: enrichedApps?.filter(a => a.date_applied === today).length || 0
      })

    } catch (error) {
      console.error('Error:', error)
    }
    
    setLoading(false)
  }

  // Filter by search term
  const filteredApps = applications.filter(app => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      app.company?.toLowerCase().includes(term) ||
      app.job_title?.toLowerCase().includes(term) ||
      app.client_name?.toLowerCase().includes(term) ||
      app.location?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1">Track all logged job applications</p>
        </div>
        <DateFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.today}</p>
          <p className="text-sm text-gray-500">Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{stats.flagged}</p>
          <p className="text-sm text-gray-500">Flagged</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Client Filter */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name || ''}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Company, title, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Flagged Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showFlaggedOnly}
                onChange={(e) => setShowFlaggedOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Flagged only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-jw-500" size={32} />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No applications found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div>
          {filteredApps.map(app => (
            <ApplicationRow
              key={app.id}
              app={app}
              expanded={expandedId === app.id}
              onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
