import React, { useState } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Badge, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled(AppBar)`
  && {
    background-color: #ff6b00;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  flex-grow: 1;
  color: white;
  cursor: pointer;
`;

const NavItems = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    color: white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const CartDialog = styled(Dialog)`
  .MuiDialog-paper {
    min-width: 400px;
    max-width: 600px;
    border-radius: 12px;
  }
`;

const DialogTitleStyled = styled(DialogTitle)`
  && {
    background-color: #ff6b00;
    color: white;
    padding: 1rem 1.5rem;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 0.5rem;
  color: #333;
`;

const ItemPrice = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const CartFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
`;

const TotalPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const CheckoutButton = styled(Button)`
  && {
    width: 100%;
    padding: 1rem 1.5rem;
    background-color: #ff6b00;
    color: white;
    margin-top: 1rem;
    font-weight: 500;
    
    &:hover {
      background-color: #ff8533;
    }
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Mock cart data
  const mockCartItems = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 199.99,
      quantity: 1,
      image: "/images/electronics.jpg"
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      quantity: 2,
      image: "/images/clothes-on-chair.jpg"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 149.99,
      quantity: 1,
      image: "/images/fitness.jpg"
    }
  ];

  const totalItems = mockCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <HeaderContainer position="sticky">
        <Toolbar>
          <Logo onClick={() => navigate('/')}>ShopVerse</Logo>
          <NavItems>
            <StyledIconButton onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={totalItems} color="error">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </Badge>
            </StyledIconButton>
          </NavItems>
        </Toolbar>
      </HeaderContainer>

      <CartDialog open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <DialogTitleStyled>Shopping Cart ({totalItems} items)</DialogTitleStyled>
        <DialogContent>
          {mockCartItems.map((item) => (
            <CartItem key={item.id}>
              <ItemImage src={item.image} alt={item.name} />
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
              </ItemDetails>
              <ItemQuantity>
                Qty: {item.quantity}
              </ItemQuantity>
            </CartItem>
          ))}
          {totalItems === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              Your cart is empty
            </div>
          )}
        </DialogContent>
        <CartFooter>
          <TotalPrice>Total: ${totalPrice.toFixed(2)}</TotalPrice>
          <CheckoutButton onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutButton>
        </CartFooter>
      </CartDialog>
    </>
  );
};

export default Header; 