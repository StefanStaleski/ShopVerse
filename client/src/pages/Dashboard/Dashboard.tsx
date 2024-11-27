import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../../utils/auth.storage';
import DashboardHeader from '../../components/common/Header/DashboardHeader';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2.2rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ActionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ActionTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userData = authStorage.get()?.user;

  useEffect(() => {
    if (!authStorage.get()) {
      navigate('/login');
    }
  }, [navigate]);

  if (!userData) {
    return null;
  }

  return (
    <>
      <DashboardHeader />
      <DashboardContainer>
        <WelcomeSection>
          <Title>Welcome back, {userData.firstName}!</Title>
          <Subtitle>Here's what you can do today</Subtitle>
          <QuickActions>
            <ActionCard onClick={() => navigate('/account')}>
              <ActionTitle>Manage Account</ActionTitle>
              <ActionDescription>Update your profile and preferences</ActionDescription>
            </ActionCard>
            {/* Add more action cards as needed */}
          </QuickActions>
        </WelcomeSection>
      </DashboardContainer>
    </>
  );
};

export default Dashboard; 