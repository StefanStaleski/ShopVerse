import React from 'react';
import styled from 'styled-components';

const StrengthContainer = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div<{ strength: number }>`
  height: 4px;
  background: ${({ strength }) => {
    if (strength === 0) return '#e0e0e0';
    if (strength === 1) return '#f44336';
    if (strength === 2) return '#ff9800';
    if (strength === 3) return '#fdd835';
    return '#4caf50';
  }};
  width: ${({ strength }) => (strength * 25)}%;
  transition: all 0.3s ease;
  border-radius: 2px;
`;

const StrengthText = styled.span<{ strength: number }>`
  font-size: 0.8rem;
  color: ${({ strength }) => {
    if (strength === 0) return '#757575';
    if (strength === 1) return '#f44336';
    if (strength === 2) return '#ff9800';
    if (strength === 3) return '#fdd835';
    return '#4caf50';
  }};
`;

interface Props {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ password }) => {
  const calculateStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];

  return (
    <StrengthContainer>
      <StrengthBar strength={strength} />
      <StrengthText strength={strength}>{strengthText}</StrengthText>
    </StrengthContainer>
  );
}; 