import React from 'react';
import styled from 'styled-components';
import { GitHub, LinkedIn } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 2rem 0;
  margin-top: auto;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Copyright = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <SocialLinks>
          <IconButton
            href="https://github.com/StefanStaleski"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <GitHub />
          </IconButton>
          <IconButton
            href="https://mk.linkedin.com/in/stefan-staleski-051030237"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <LinkedIn />
          </IconButton>
        </SocialLinks>
        <Copyright>
          © {currentYear} ShopVerse. Created by Stefan Staleski
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 