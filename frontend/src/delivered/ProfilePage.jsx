import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import apiClient from '../api/client'

const fmt = (n) => `₱${Number(n).toLocaleString()}`

export default function ProfilePage({ navigate }) {
  const { user, logout } = useAuth()
  const { orders } = useOrders()
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({ first_name: '', last_name: '', email: user?.email || '' })
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  const initials    = user?.username?.slice(0, 2).toUpperCase() || 'U'
  const totalSpent  = orders.reduce((a, o) => a + parseFloat(o.total || o.total_price || 0), 0)
  const totalGal    = orders.reduce((a, o) => a + (o.qty || o.quantity || 0), 0)
  const delivered   = orders.filter(o => o.status?.toLowerCase() === 'delivered').length

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setError('')
    try {
      await apiClient.patch('/auth/users/me/', form)
      setSaved(true)
      setTimeout(() => { setSaved(false); setEditing(false) }, 1500)
    } catch {
      setError('Could not save changes. Try again.')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('welcome')
  }

  return (
    <div className="profile-layout">
      {/* Left panel */}
      <div className="profile-left">
        <div className="profile-card">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-name">{user?.username}</div>
          <div className="profile-loc">{user?.email || 'No email set'}</div>
          {user?.is_staff && <div className="staff-badge">⚙️ Staff</div>}
        </div>

        <div className="profile-stats-card">
          <div className="pstat"><div className="pstat-val">{orders.length}</div><div className="pstat-label">Total Orders</div></div>
          <div className="pstat"><div className="pstat-val">{delivered}</div><div className="pstat-label">Delivered</div></div>
          <div className="pstat"><div className="pstat-val">{totalGal}</div><div className="pstat-label">Gallons</div></div>
          <div className="pstat"><div className="pstat-val">{fmt(totalSpent)}</div><div className="pstat-label">Total Spent</div></div>
        </div>
      </div>

      {/* Right panel */}
      <div className="profile-right">

        {/* Edit profile section */}
        <div className="profile-section-title">Account Information</div>
        <div className="profile-info-card">
          {!editing ? (
            <>
              <div className="pi-row"><span>Username</span><strong>{user?.username}</strong></div>
              <div className="pi-row"><span>Email</span><strong>{user?.email || '—'}</strong></div>
              <button className="btn-ghost" onClick={() => setEditing(true)} style={{marginTop:'12px'}}>Edit Profile</button>
            </>
          ) : (
            <>
              {error && <div className="login-error">{error}</div>}
              {saved && <div className="save-success">✓ Saved successfully!</div>}
              <div className="field"><label className="form-label">Email</label>
                <input className="text-inp" type="email" value={form.email} onChange={set('email')} /></div>
              <div className="form-row-2">
                <div className="field"><label className="form-label">First Name</label>
                  <input className="text-inp" value={form.first_name} onChange={set('first_name')} /></div>
                <div className="field"><label className="form-label">Last Name</label>
                  <input className="text-inp" value={form.last_name} onChange={set('last_name')} /></div>
              </div>
              <div className="modal-btns" style={{marginTop:'12px'}}>
                <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </>
          )}
        </div>

        {/* Settings menu */}
        <div className="profile-section-title" style={{marginTop:'20px'}}>Settings</div>
        <div className="profile-menu">
          {[
            { label: 'Saved Addresses',  icon: '📍' },
            { label: 'Payment Methods',  icon: '💳' },
            { label: 'Notifications',    icon: '🔔' },
            { label: 'Help & Support',   icon: '❓' },
          ].map(item => (
            <button key={item.label} className="profile-menu-item">
              <span>{item.icon} {item.label}</span>
              <span className="chevron">›</span>
            </button>
          ))}
          <button className="profile-menu-item signout" onClick={handleLogout}>
            <span>🚪 Sign Out</span>
            <span className="chevron">›</span>
          </button>
        </div>
      </div>
    </div>
  )
}