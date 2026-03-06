import { useOrders } from '../context/OrdersContext'

const fmt = (n) => `₱${Number(n).toLocaleString()}`

const STATUS_COLOR = {
  delivered:  { bg: '#d1fae5', color: '#059669' },
  pending:    { bg: '#fef3c7', color: '#d97706' },
  processing: { bg: '#dbeafe', color: '#1d4ed8' },
  shipped:    { bg: '#ede9fe', color: '#7c3aed' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626' },
}

export default function HistoryPage({ navigate }) {
  const { orders, loading, fetchOrders } = useOrders()

  const getStyle = (status) => STATUS_COLOR[status?.toLowerCase()] || { bg: '#f1f5f9', color: '#64748b' }

  return (
    <div>
      <div className="history-toolbar">
        <span className="toolbar-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        <button className="btn-ghost" onClick={fetchOrders} disabled={loading}>
          {loading ? '⟳ Refreshing…' : '↺ Refresh'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty">
          <span>📋</span>
          <p>No orders yet.</p>
          <button className="btn-primary" onClick={() => navigate('browse')}>Browse Stations</button>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Station / Notes</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const s = getStyle(o.status)
                return (
                  <tr key={o.id}>
                    <td className="td-muted">#{o.id}</td>
                    <td className="td-station">{o.station || o.notes || o.shipping_address || '—'}</td>
                    <td className="td-muted">{o.date || o.created_at?.slice(0,10) || '—'}</td>
                    <td>{o.qty || o.quantity || '—'} gal</td>
                    <td className="td-price">{fmt(o.total || o.total_price || 0)}</td>
                    <td>
                      <span className="oc-status" style={{ background: s.bg, color: s.color }}>{o.status}</span>
                    </td>
                    <td className="td-actions">
                      {['pending','processing','shipped'].includes(o.status?.toLowerCase()) && (
                        <button className="reorder-btn" onClick={() => navigate('track', { orderId: o.id })}>📍 Track</button>
                      )}
                      <button className="reorder-btn" onClick={() => navigate('browse')}>↻ Reorder</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}