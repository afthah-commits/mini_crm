import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import LeadForm from '../components/LeadForm'
import LeadTable from '../components/LeadTable'
import NotesPanel from '../components/NotesPanel'
import { getUsers } from '../services/authService'
import { addLeadNote, createLead, deleteLead, getLeads, updateLead } from '../services/leadService'

const LeadsPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [noteSaving, setNoteSaving] = useState(false)
  const [leads, setLeads] = useState([])
  const [users, setUsers] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [editingLead, setEditingLead] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')

  const filters = useMemo(() => {
    const params = {}
    if (query) params.q = query
    if (status) params.status = status
    return params
  }, [query, status])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const data = await getLeads(filters)
      setLeads(data)
      if (selectedLead) {
        const refreshed = data.find((lead) => lead.id === selectedLead.id)
        setSelectedLead(refreshed || null)
      }
    } catch {
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch {
      toast.error('Failed to load users')
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [filters.q, filters.status])

  useEffect(() => {
    fetchUsers()
  }, [])

  const submitLead = async (payload) => {
    try {
      setSaving(true)
      if (editingLead) {
        await updateLead(editingLead.id, payload)
        toast.success('Lead updated')
      } else {
        await createLead(payload)
        toast.success('Lead created')
      }
      setEditingLead(null)
      fetchLeads()
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const removeLead = async (leadId) => {
    try {
      await deleteLead(leadId)
      toast.success('Lead deleted')
      fetchLeads()
      if (selectedLead?.id === leadId) setSelectedLead(null)
    } catch {
      toast.error('Delete failed')
    }
  }

  const addNote = async (content) => {
    if (!selectedLead) return
    try {
      setNoteSaving(true)
      await addLeadNote(selectedLead.id, { content })
      toast.success('Note added')
      fetchLeads()
    } catch {
      toast.error('Unable to add note')
    } finally {
      setNoteSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Leads</h2>
        <p className="muted text-sm">Manage, assign, and follow up with leads.</p>
      </div>

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold">{editingLead ? 'Edit Lead' : 'Add Lead'}</h3>
        <LeadForm
          onSubmit={submitLead}
          initialLead={editingLead}
          onCancel={() => setEditingLead(null)}
          isSubmitting={saving}
          users={users}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          placeholder="Search by name or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Closed">Closed</option>
        </select>
        <button
          type="button"
          onClick={fetchLeads}
          className="btn-primary"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="muted text-sm">Loading leads...</div>
      ) : (
        <LeadTable leads={leads} onEdit={setEditingLead} onDelete={removeLead} onSelectLead={setSelectedLead} />
      )}

      <NotesPanel lead={selectedLead} onAddNote={addNote} isSaving={noteSaving} />
    </div>
  )
}

export default LeadsPage
