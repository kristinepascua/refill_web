import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { FaShoppingCart, FaCalendarAlt, FaHistory, FaTint, FaStar, FaMapMarkerAlt } from "react-icons/fa"
import StationModal from '../modals/StationModals'

const fmt = (n) => `₱${Number(n).toLocaleString()}`

export default function HomePage({ navigate }) {

  const { user } = useAuth()
  const { orders } = useOrders()
  const [selectedStation, setSelectedStation] = useState(null)

  const aquapure = { id: 1, name: 'AquaPure Station', icon: <FaTint/>, distance: '0.5 km', pricePerGallon: 25, deliveryFee: 20, eta: '15-20 min', rating: 4.8, waterTypes: ['Purified','Alkaline'], open: true }

  const recentOrders = orders.slice(0,3)

  return (
    <>
    



<div className="dashboard">

<main className="main">

<div className="topbar">
  <h2>Hello, {user?.username} 👋</h2>
  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
    <FaMapMarkerAlt/> Carmen, Cagayan de Oro
  </div>
</div>


{/* QUICK ACTIONS */}

<div className="quick-grid">

<div className="quick-card" onClick={()=>navigate('browse')}>
<FaShoppingCart size={28}/>
<p>Refill Now</p>
</div>

<div className="quick-card" onClick={()=>navigate('schedule')}>
<FaCalendarAlt size={28}/>
<p>Schedule</p>
</div>

<div className="quick-card" onClick={()=>navigate('history')}>
<FaHistory size={28}/>
<p>History</p>
</div>

</div>


{/* NEARBY STATIONS */}

<div className="section">

<h3>Nearby Stations</h3>

<div className="station-grid">

<div className="station-card">

  <div className="station-header">

    <div className="station-left">
      <div className="station-icon">
        <FaTint/>
      </div>

      <div>
        <button className="sc-name sc-name-link" onClick={() => setSelectedStation(aquapure)}>AquaPure Station</button>
        <p className="station-distance">
          <FaMapMarkerAlt/> 0.5 km
        </p>
      </div>
    </div>

    <div className="station-rating">
      <FaStar/> 4.8
    </div>

  </div>


  <div className="station-tags">
    <span>Purified</span>
    <span>Alkaline</span>
  </div>


  <div className="station-info">

    <div>
      <p>PER GALLON</p>
      <h4>₱25</h4>
    </div>

    <div>
      <p>DELIVERY</p>
      <h4>₱20</h4>
    </div>

    <div>
      <p>ETA</p>
      <h4>15–20 min</h4>
    </div>

  </div>


  <div className="station-actions">

    <button
      className="order-btn"
      onClick={() => navigate("browse")}
    >
      <FaShoppingCart/>
      Order Now
    </button>

    <button
      className="calendar-btn"
      onClick={() => navigate("schedule")}
    > 
      <FaCalendarAlt/>
    </button>

  </div>

</div>

</div>

</div>


{/* RECENT ORDERS */}

<div className="section">

<h3>Recent Orders</h3>

{recentOrders.map(o => (

<div key={o.id} className="order-card">

<div>
<strong>{o.station || "Water Station"}</strong>
<p>{o.qty || 0} gal</p>
</div>

<div>
<span>{o.status}</span>
<p>{fmt(o.total || 0)}</p>
</div>

</div>

))}

</div>


</main>

</div>


      {selectedStation && (
        <StationModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onOrder={s => { setSelectedStation(null); navigate('order', { station: s }) }}
          onSchedule={s => { setSelectedStation(null); navigate('schedule', { station: s }) }}
        />
      )}

</>
  )
}