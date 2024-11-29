import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import DashboardHeader from '../../components/common/Header/DashboardHeader';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1.5px solid #e1e1e1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }
`;

const OrderSummary = styled(CheckoutSection)`
  height: fit-content;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const TotalAmount = styled(SummaryItem)`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1.5rem;
  border-top: 2px solid #eee;
  padding-top: 1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    background-color: #ff8533;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Add payment processing logic here
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/order-confirmation');
    }, 2000);
  };

  return (
    <>
      <DashboardHeader />
      <CheckoutContainer>
        <div>
          <CheckoutSection>
            <SectionTitle>Shipping Information</SectionTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Full Name</Label>
                <Input type="text" required />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" required />
              </FormGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input type="text" required />
              </FormGroup>
              <FormGroup>
                <Label>City</Label>
                <Input type="text" required />
              </FormGroup>
              <FormGroup>
                <Label>Postal Code</Label>
                <Input type="text" required />
              </FormGroup>
            </form>
          </CheckoutSection>
          
          <CheckoutSection>
            <SectionTitle>Payment Information</SectionTitle>
            <FormGroup>
              <Label>Card Number</Label>
              <Input type="text" placeholder="**** **** **** ****" required />
            </FormGroup>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label>Expiry Date</Label>
                <Input type="text" placeholder="MM/YY" required />
              </FormGroup>
              <FormGroup>
                <Label>CVV</Label>
                <Input type="text" placeholder="***" required />
              </FormGroup>
            </div>
          </CheckoutSection>
        </div>

        <OrderSummary>
          <SectionTitle>Order Summary</SectionTitle>
          <SummaryItem>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>${shipping.toFixed(2)}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Tax</SummaryLabel>
            <SummaryValue>${tax.toFixed(2)}</SummaryValue>
          </SummaryItem>
          <TotalAmount>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>${total.toFixed(2)}</SummaryValue>
          </TotalAmount>
          <CheckoutButton 
            disabled={isProcessing} 
            onClick={handleSubmit}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </CheckoutButton>
        </OrderSummary>
      </CheckoutContainer>
    </>
  );
};

export default Checkout; 