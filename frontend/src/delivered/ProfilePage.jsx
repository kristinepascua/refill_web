import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const fmt = (n) => `₱${Number(n).toLocaleString()}`;

export default function ProfilePage({ navigate }) {
  const { user, logout } = useAuth();
  const { orders } = useOrders();

  // --- State for New Features ---
  const [editing, setEditing] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 1, text: '123 Main St, Carmen, CDO', isDefault: true },
    { id: 2, text: '456 Business Hub, Nazareno, CDO', isDefault: false },
  ]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'); // Placeholder

  // --- Logic ---
  const totalGal = orders.reduce((a, o) => a + (o.qty || 0), 0);
  const deliveredCount = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;
  // Logic: 0.1 per gallon + 0.3 per delivered order (assuming review)
  const points = (totalGal * 0.1) + (deliveredCount * 0.3);

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const removeAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="profile-layout">
      {/* LEFT SIDEBAR */}
      <div className="profile-left">
        <div className="profile-card">
          <div className="avatar-wrapper">
            <img src={avatar} alt="Profile" className="profile-avatar-lg" />
            <div className="avatar-selector">
              <button onClick={() => setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')}>1</button>
              <button onClick={() => setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka')}>2</button>
              <button onClick={() => setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=Max')}>3</button>
            </div>
          </div>
          <div className="profile-name">{user?.username || 'Guest'}</div>
          <div className="user-type-badge">CUSTOMER</div>
        </div>

        <div className="profile-stats-card">
          <div className="pstat">
            <div className="pstat-val">{orders.length}</div>
            <div className="pstat-label">Total Orders</div>
          </div>
          <button className="sidebar-btn" onClick={() => navigate('history')}>📜 Order History</button>
          
          <div className="pstat">
            <div className="pstat-val">{points.toFixed(1)}</div>
            <div className="pstat-label">Points Earned</div>
          </div>
          <button className="sidebar-btn">⭐ Stations Review</button>
          <button className="sidebar-btn">📱 Review App</button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="profile-right">
        {/* Account Info */}
        <div className="profile-section-title">Account Information</div>
        <div className="profile-info-card">
          <div className="pi-row"><span>Name</span><strong>{user?.username}</strong></div>
          <div className="pi-row"><span>Phone</span><strong>{user?.phone || '0917-XXX-XXXX'}</strong></div>
          <div className="pi-row"><span>Email</span><strong>{user?.email}</strong></div>
          <div className="pi-row">
            <span>Payment Method</span>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="inline-select">
              <option value="COD">COD</option>
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
            </select>
          </div>

          <div className="address-container">
            <p className="sub-label">Delivery Addresses</p>
            {addresses.map(addr => (
              <div key={addr.id} className={`addr-pill ${addr.isDefault ? 'is-default' : ''}`}>
                <span>{addr.text}</span>
                <div className="addr-actions">
                  {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)}>Set Default</button>}
                  <button className="del-btn" onClick={() => removeAddress(addr.id)}>Remove</button>
                </div>
              </div>
            ))}
            <button className="add-addr-btn">+ Add New Address</button>
          </div>
        </div>

        {/* Settings */}
        <div className="profile-section-title" style={{ marginTop: '24px' }}>Settings</div>
        <div className="profile-menu">
          <div className="profile-menu-item no-click">
            <span>SMS Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="profile-menu-item no-click">
            <span>Email Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <button className="profile-menu-item">
            <span>Change Password</span>
            <span className="chevron">›</span>
          </button>
          <button className="profile-menu-item danger-item" onClick={() => alert('Deactivate?')}>
            <span>Deactivate Account</span>
            <span className="chevron">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}