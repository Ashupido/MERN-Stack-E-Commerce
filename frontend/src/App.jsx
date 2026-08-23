import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import ToastContainer from './components/common/ToastContainer';
import { useToast } from './hooks/useToast';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-slate-950 text-white">
              <ToastContainer toasts={toasts} onRemove={removeToast} />
              <AppRoutes addToast={addToast} />
            </div>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
