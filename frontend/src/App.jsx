import './App.css'
import { AuthProvider } from './context/AuthContext'
import { OrdersProvider } from './context/OrdersContext'
import AppRouter from './components/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <AppRouter />
      </OrdersProvider>
    </AuthProvider>
  )
}