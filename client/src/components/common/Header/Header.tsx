import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Badge } from '@mui/material';
import { ShoppingCart, Person, Search } from '@mui/icons-material';

const HeaderContainer = styled(AppBar)`
  background-color: white;
  color: #333;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  flex-grow: 1;
  color: #ff6b00;
`;

const NavItems = styled.div`
  display: flex;
  gap: 1rem;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer position="sticky">
      <Toolbar>
        <Logo>ShopVerse</Logo>
        <NavItems>
          <IconButton color="inherit">
            <Search />
          </IconButton>
          <IconButton color="inherit">
            <Person />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </NavItems>
      </Toolbar>
    </HeaderContainer>
  );
};

export default Header; 