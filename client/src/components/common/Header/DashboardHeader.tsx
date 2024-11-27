import React from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { authStorage } from '../../../utils/auth.storage';

const HeaderContainer = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
    color: #ff6b00;
  }

  &.active {
    color: #ff6b00;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ff6b00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 6px;

  &:hover {
    background-color: #fee5d3;
    color: #ff6b00;
  }
`;

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const userData = authStorage.get()?.user;

  const handleLogout = () => {
    authStorage.clear();
    navigate('/login');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavLinks>
          <StyledLink to="/dashboard">Dashboard</StyledLink>
          <StyledLink to="/account">Account</StyledLink>
        </NavLinks>
        <UserSection>
          <UserInfo>
            <Avatar>
              {userData && getInitials(userData.firstName, userData.lastName)}
            </Avatar>
            <span>{userData?.firstName} {userData?.lastName}</span>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserSection>
      </Nav>
    </HeaderContainer>
  );
};

export default DashboardHeader; 