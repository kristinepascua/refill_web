import './App.css'
import { AuthProvider } from './context/AuthContext'
import { OrdersProvider } from './context/OrdersContext'
import { NotificationsProvider } from './context/NotificationContext'
import AppRouter from './components/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <NotificationsProvider>
          <AppRouter />
        </NotificationsProvider>
      </OrdersProvider>
    </AuthProvider>
  )
}