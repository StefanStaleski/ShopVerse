import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Badge } from '@mui/material';
import { ShoppingCart, Person, Search } from '@mui/icons-material';

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

const Header: React.FC = () => {
  return (
    <HeaderContainer position="sticky">
      <Toolbar>
        <Logo>ShopVerse</Logo>
        <NavItems>
          <StyledIconButton>
            <Search />
          </StyledIconButton>
          <StyledIconButton>
            <Person />
          </StyledIconButton>
          <StyledIconButton>
            <Badge badgeContent={0} color="error">
              <ShoppingCart />
            </Badge>
          </StyledIconButton>
        </NavItems>
      </Toolbar>
    </HeaderContainer>
  );
};

export default Header; 