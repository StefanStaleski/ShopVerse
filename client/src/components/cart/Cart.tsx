import React from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import { motion, AnimatePresence } from 'framer-motion';

const CartOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CartTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  
  &:hover {
    color: #ff6b00;
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CartFooter = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff8533;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {state.isOpen && (
        <CartOverlay
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <CartHeader>
            <CartTitle>Your Cart</CartTitle>
            <CloseButton onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
              ×
            </CloseButton>
          </CartHeader>

          <CartItems>
            {state.items.length === 0 ? (
              <EmptyCart>Your cart is empty</EmptyCart>
            ) : (
              state.items.map(item => (
                <CartItem key={item.id} item={item} />
              ))
            )}
          </CartItems>

          <CartFooter>
            <Total>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </Total>
            <CheckoutButton
              disabled={state.items.length === 0}
              onClick={() => {/* Implement checkout logic */}}
            >
              Proceed to Checkout
            </CheckoutButton>
          </CartFooter>
        </CartOverlay>
      )}
    </AnimatePresence>
  );
};

export default Cart; 