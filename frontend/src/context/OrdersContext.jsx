import { createContext, useContext, useState, useEffect } from 'react'
import { ordersAPI } from '../api/orders'
import { useAuth } from './AuthContext'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    if (!user) return
    setLoading(true)
    try {
      const r = await ordersAPI.getAll()
      const data = Array.isArray(r.data) ? r.data : r.data?.results || []
      setOrders(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!user) { setOrders([]); return }
    fetchOrders()
  }, [user])

  const addOrder = (order) => setOrders(prev => [order, ...prev])

  return (
    <OrdersContext.Provider value={{ orders, loading, fetchOrders, addOrder, setOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)