import { BrowserRouter as Router } from 'react-router-dom';
import ToastContainer from './components/common/ToastContainer';
import { useToast } from './hooks/useToast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-950">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <AppRoutes addToast={addToast} />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
