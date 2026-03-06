import { useState } from 'react'
import { ordersAPI } from '../api/orders'
import { useOrders } from '../context/OrdersContext'

const fmt = (n) => `₱${Number(n).toLocaleString()}`

export default function OrderPage({ navigate, station }) {
  const { addOrder } = useOrders()
  const [qty, setQty]         = useState(1)
  const [address, setAddress] = useState('Carmen, Cagayan de Oro City')
  const [type, setType]       = useState(station?.waterTypes?.[0] || 'Purified')
  const [step, setStep]       = useState(1) // 1=configure, 2=review, 3=success
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  if (!station) return (
    <div className="order-page">
      <div className="empty"><span>💧</span><p>No station selected.</p>
        <button className="btn-primary" onClick={() => navigate('browse')}>Browse Stations</button>
      </div>
    </div>
  )

  const subtotal = qty * station.pricePerGallon
  const total    = subtotal + station.deliveryFee

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await ordersAPI.create({
        shipping_address: address,
        status: 'pending',
        notes: `${qty}x ${type} from ${station.name}`,
      })
      const newOrder = {
        id: res.data.id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        station: station.name, qty,
        total: res.data.total_price || total,
        status: res.data.status || 'pending',
      }
      addOrder(newOrder)
      setOrderId(res.data.id)
      setStep(3)
    } catch {
      // Fallback local order
      const localOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        station: station.name, qty, total, status: 'pending',
      }
      addOrder(localOrder)
      setOrderId(localOrder.id)
      setStep(3)
    } finally { setLoading(false) }
  }

  return (
    <div className="order-page">
      {/* Back button */}
      {step < 3 && (
        <button className="order-back" onClick={() => step === 1 ? navigate('browse') : setStep(1)}>
          ← {step === 1 ? 'Back to Browse' : 'Back'}
        </button>
      )}

      {/* Step indicator */}
      {step < 3 && (
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}><span>1</span> Configure</div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}><span>2</span> Review</div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}><span>3</span> Confirm</div>
        </div>
      )}

      <div className="order-container">
        {/* Station header */}
        {step < 3 && (
          <div className="order-station-header">
            <span className="order-station-emoji">{station.emoji}</span>
            <div>
              <div className="order-station-name">{station.name}</div>
              <div className="order-station-meta">📍 {station.distance} · ⏱ {station.eta} · ⭐ {station.rating}</div>
            </div>
          </div>
        )}

        {/* Step 1: Configure */}
        {step === 1 && (
          <div className="order-layout">
            <div className="order-form">
              <div className="form-section">
                <label className="form-label">Water Type</label>
                <div className="type-pills">
                  {station.waterTypes.map(t => (
                    <button key={t} className={`type-pill ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Number of Gallons</label>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <p className="qty-hint">Minimum 1 gallon per order</p>
              </div>

              <div className="form-section">
                <label className="form-label">Delivery Address</label>
                <input className="text-inp" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>

            <div className="order-summary-panel">
              <div className="price-breakdown">
                <div className="pb-title">Order Summary</div>
                <div className="price-row"><span>Water type</span><span>{type}</span></div>
                <div className="price-row"><span>Per gallon</span><span>{fmt(station.pricePerGallon)}</span></div>
                <div className="price-row"><span>Quantity</span><span>{qty} gal</span></div>
                <div className="price-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="price-row"><span>Delivery fee</span><span>{fmt(station.deliveryFee)}</span></div>
                <div className="price-row total"><span>Total</span><span>{fmt(total)}</span></div>
              </div>
              <button className="btn-primary full" onClick={() => setStep(2)}>Review Order →</button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="order-review">
            <h3 className="review-title">Review your order</h3>
            <div className="confirm-block">
              <div className="confirm-row"><span>Station</span><strong>{station.name}</strong></div>
              <div className="confirm-row"><span>Water Type</span><strong>{type}</strong></div>
              <div className="confirm-row"><span>Quantity</span><strong>{qty} gallon{qty > 1 ? 's' : ''}</strong></div>
              <div className="confirm-row"><span>Deliver to</span><strong>{address}</strong></div>
              <div className="confirm-row"><span>ETA</span><strong>{station.eta}</strong></div>
              <div className="confirm-row highlight"><span>Total</span><strong>{fmt(total)}</strong></div>
            </div>
            <div className="modal-btns">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Edit</button>
              <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Placing order…' : 'Confirm Order ✓'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="success-screen">
            <div className="success-ripple"><span>💧</span></div>
            <h2>Order Placed!</h2>
            <p>Your water is on its way from<br /><strong>{station.name}</strong></p>
            <p>ETA: <strong>{station.eta}</strong></p>
            {orderId && <p className="order-id-label">Order #{orderId}</p>}
            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate('track', { orderId })}>📍 Track Order</button>
              <button className="btn-ghost"   onClick={() => navigate('home')}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}