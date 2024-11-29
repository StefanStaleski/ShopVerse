import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { CartProvider } from './context/CartContext';
import Cart from './components/cart/Cart';

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Cart />
    </CartProvider>
  );
};

export default App;
