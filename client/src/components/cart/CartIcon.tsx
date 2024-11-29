import React from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const CartIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff6b00;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  transform: translate(25%, -25%);
`;

const StyledIcon = styled(FaShoppingCart)`
  color: #333;
  font-size: 1.5rem;
  
  &:hover {
    color: #ff6b00;
  }
`;

const CartIcon: React.FC = () => {
  const { state, dispatch } = useCart();
  
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartIconWrapper onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
      <StyledIcon />
      {itemCount > 0 && <CartCount>{itemCount}</CartCount>}
    </CartIconWrapper>
  );
};

export default CartIcon; 