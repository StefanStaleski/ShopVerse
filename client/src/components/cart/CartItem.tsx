import React from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { CartItem as CartItemType } from '../../context/CartContext';

const ItemContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const ItemPrice = styled.span`
  font-weight: 500;
  color: #ff6b00;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }

  &:disabled {
    background: #f5f5f5;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 24px;
  text-align: center;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #ff4444;
  }
`;

const ItemSubtotal = styled.div`
  font-weight: 500;
  color: #333;
  min-width: 80px;
  text-align: right;
`;

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: item.id, quantity: newQuantity }
    });
  };

  const handleRemoveItem = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: item.id
    });
  };

  const subtotal = item.price * item.quantity;

  return (
    <ItemContainer>
      <ItemImage src={item.image} alt={item.name} />
      <ItemDetails>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
        <QuantityControls>
          <QuantityButton
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </QuantityButton>
          <QuantityDisplay>{item.quantity}</QuantityDisplay>
          <QuantityButton
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
          >
            +
          </QuantityButton>
        </QuantityControls>
      </ItemDetails>
      <ItemSubtotal>${subtotal.toFixed(2)}</ItemSubtotal>
      <RemoveButton onClick={handleRemoveItem}>×</RemoveButton>
    </ItemContainer>
  );
};

export default CartItem; 