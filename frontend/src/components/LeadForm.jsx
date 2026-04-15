import { useEffect, useState } from 'react'

const statuses = ['New', 'Contacted', 'Interested', 'Closed']

const LeadForm = ({ onSubmit, initialLead, onCancel, isSubmitting, users = [] }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New',
    follow_up_date: '',
    assigned_to: '',
  })

  useEffect(() => {
    if (initialLead) {
      setForm({
        name: initialLead.name || '',
        email: initialLead.email || '',
        phone: initialLead.phone || '',
        source: initialLead.source || '',
        status: initialLead.status || 'New',
        follow_up_date: initialLead.follow_up_date || '',
        assigned_to: initialLead.assigned_to || '',
      })
    }
  }, [initialLead])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      follow_up_date: form.follow_up_date || null,
    })
  }

  return (
    <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
      {['name', 'email', 'phone', 'source'].map((field) => (
        <input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={field}
          required={['name', 'email', 'phone'].includes(field)}
          className="field"
        />
      ))}

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="field"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="follow_up_date"
        value={form.follow_up_date}
        onChange={handleChange}
        className="field"
      />

      <select
        name="assigned_to"
        value={form.assigned_to}
        onChange={handleChange}
        className="field md:col-span-2"
      >
        <option value="">Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>

      <div className="flex gap-2 md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Saving...' : initialLead ? 'Update Lead' : 'Create Lead'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-muted"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default LeadForm
