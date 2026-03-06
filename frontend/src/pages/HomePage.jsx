import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'

const fmt = (n) => `₱${Number(n).toLocaleString()}`

const STATUS_COLOR = {
  delivered:  '#10b981', pending: '#f59e0b',
  processing: '#3b82f6', shipped: '#8b5cf6', cancelled: '#ef4444',
}

export default function HomePage({ navigate }) {
  const { user } = useAuth()
  const { orders } = useOrders()

  const recentOrders  = orders.slice(0, 3)
  const totalSpent    = orders.reduce((a, o) => a + parseFloat(o.total || o.total_price || 0), 0)
  const totalGallons  = orders.reduce((a, o) => a + (o.qty || o.quantity || 0), 0)
  const pendingOrders = orders.filter(o => ['pending','processing','shipped'].includes(o.status?.toLowerCase()))

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="home-page">
      {/* Hero greeting */}
      <div className="home-hero">
        <div className="home-hero-text">
          <p className="home-greeting">Hello, {user?.username}! 👋</p>
          <h2 className="home-headline">Need a refill today?</h2>
          <p className="home-desc">Order fresh water delivered to your door in minutes.</p>
          <button className="btn-primary" onClick={() => navigate('browse')}>🛒 Order Now</button>
        </div>
        <div className="home-hero-art">💧</div>
      </div>

      {/* Stats row */}
      <div className="home-stats">
        <div className="hstat"><div className="hstat-val">{orders.length}</div><div className="hstat-label">Total Orders</div></div>
        <div className="hstat"><div className="hstat-val">{totalGallons}</div><div className="hstat-label">Gallons</div></div>
        <div className="hstat"><div className="hstat-val">{fmt(totalSpent)}</div><div className="hstat-label">Total Spent</div></div>
        <div className="hstat"><div className="hstat-val">{pendingOrders.length}</div><div className="hstat-label">Active</div></div>
      </div>

      {/* Quick actions */}
      <div className="home-section">
        <div className="home-section-title">Quick Actions</div>
        <div className="quick-actions">
          <button className="qa-btn" onClick={() => navigate('browse')}>
            <span className="qa-icon">🛒</span><span>Refill Now</span>
          </button>
          <button className="qa-btn" onClick={() => navigate('schedule')}>
            <span className="qa-icon">📅</span><span>Schedule</span>
          </button>
          <button className="qa-btn" onClick={() => navigate('history')}>
            <span className="qa-icon">📋</span><span>History</span>
          </button>
          <button className="qa-btn" onClick={() => navigate('track')}>
            <span className="qa-icon">📍</span><span>Track</span>
          </button>
        </div>
      </div>

      {/* Active orders alert */}
      {pendingOrders.length > 0 && (
        <div className="active-orders-banner" onClick={() => navigate('track', { order: pendingOrders[0] })}>
          <span>🚚</span>
          <div>
            <div className="aob-title">You have {pendingOrders.length} active order{pendingOrders.length > 1 ? 's' : ''}</div>
            <div className="aob-sub">Tap to track your delivery</div>
          </div>
          <span className="chevron">›</span>
        </div>
      )}

      {/* Recent orders */}
      <div className="home-section">
        <div className="home-section-header">
          <div className="home-section-title">Recent Orders</div>
          {orders.length > 0 && (
            <button className="link-btn" onClick={() => navigate('history')}>View all →</button>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="home-empty">
            <span>📋</span>
            <p>No orders yet — place your first one!</p>
            <button className="btn-primary" onClick={() => navigate('browse')}>Browse Stations</button>
          </div>
        ) : (
          <div className="recent-orders">
            {recentOrders.map(o => (
              <div key={o.id} className="ro-card">
                <div className="ro-top">
                  <div className="ro-station">{o.station || o.notes || o.shipping_address || '—'}</div>
                  <span className="ro-status" style={{ background: STATUS_COLOR[o.status?.toLowerCase()] + '22', color: STATUS_COLOR[o.status?.toLowerCase()] }}>
                    {o.status}
                  </span>
                </div>
                <div className="ro-meta">
                  <span>{o.date || o.created_at?.slice(0,10) || '—'}</span>
                  <span>{o.qty || o.quantity || 0} gal · {fmt(o.total || o.total_price || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}