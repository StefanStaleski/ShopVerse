import styled from 'styled-components';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = styled.button<ButtonProps>`
  width: 100%;
  padding: 1rem;
  background-color: ${(props: ButtonProps) => props.isLoading ? '#ffa366' : '#ff6b00'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${(props: ButtonProps) => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${(props: ButtonProps) => props.isLoading ? '#ffa366' : '#ff8533'};
  }
`; 