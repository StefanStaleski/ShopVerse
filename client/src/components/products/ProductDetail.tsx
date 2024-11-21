import React from 'react';
import styled from 'styled-components';
import { Product } from '../../types/product';

const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const ProductPrice = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: #2a2a2a;
`;

const ProductDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <DetailContainer>
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo>
        <ProductTitle>{product.name}</ProductTitle>
        <ProductPrice>{product.price}</ProductPrice>
        <ProductDescription>{product.description}</ProductDescription>
      </ProductInfo>
    </DetailContainer>
  );
}; 