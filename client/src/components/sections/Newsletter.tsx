import React from 'react';
import styled from 'styled-components';

const NewsletterSection = styled.section`
  background-color: #ff6b00;
  padding: 4rem 0;
  color: white;
`;

const NewsletterContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`;

const SubscribeButton = styled.button`
  padding: 0.8rem 2rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }
`;

const Newsletter: React.FC = () => {
  return (
    <NewsletterSection>
      <NewsletterContent>
        <Title>Stay Updated</Title>
        <Description>
          Subscribe to our newsletter for exclusive deals and updates!
        </Description>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Input type="email" placeholder="Enter your email" />
          <SubscribeButton type="submit">Subscribe</SubscribeButton>
        </Form>
      </NewsletterContent>
    </NewsletterSection>
  );
};

export default Newsletter; 