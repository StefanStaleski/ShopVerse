import React from 'react';
import styled from 'styled-components';
import { Modal } from '../ui/Modal/Modal';
import { ProductDetail } from '../products/ProductDetail';
import { Product } from '../../types/product';

const NewArrivalsSection = styled.section`
  padding: 4rem 0;
  background-color: #f8f9fa;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
`;

const SliderContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  position: relative;
`;

const SliderTrack = styled.div<{ transform: string }>`
  display: flex;
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  transform: ${props => props.transform};
  gap: 2rem;
  padding: 0.5rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 420px;
  min-width: calc((100% - 8rem) / 5);
  margin: 0 1rem;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 20px rgba(0,0,0,0.15);
  }
`;

const Indicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Indicator = styled.div<{ active: boolean }>`
  width: 40px;
  height: 3px;
  background-color: ${props => props.active ? '#ff6b00' : '#ddd'};
  transition: background-color 0.3s ease;
  cursor: pointer;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center;
  background-color: white;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ProductInfo = styled.div`
  padding: 1rem 1.5rem;
  background-color: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
`;

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
`;

const ProductPrice = styled.p`
  color: #ff6b00;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
`;

const NewArrivals: React.FC = () => {
  const newProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds',
      price: '$129.99',
      image: '/images/products/earbuds.jpg',
      description: 'Premium wireless earbuds featuring active noise cancellation, 24-hour battery life, and crystal-clear sound quality. IPX5 water resistance and touch controls for seamless operation.'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      price: '$199.99',
      image: '/images/products/smartwatch.jpg',
      description: 'Advanced smartwatch with health monitoring, fitness tracking, and ECG capabilities. Features a bright AMOLED display, 5-day battery life, and 50+ sport modes.'
    },
    {
      id: 3,
      name: 'Premium Backpack',
      price: '$89.99',
      image: '/images/products/backpack.jpeg',
      description: 'Ergonomic design with padded laptop compartment, anti-theft pockets, and water-resistant material. Perfect for work, travel, or everyday use with 30L capacity.'
    },
    {
      id: 4,
      name: 'Noise-Canceling Headphones',
      price: '$249.99',
      image: '/images/products/headphones.jpg',
      description: 'Professional-grade headphones with adaptive noise cancellation and Hi-Res audio certification. Features 40-hour battery life and premium leather comfort padding.'
    },
    {
      id: 5,
      name: 'Fitness Tracker',
      price: '$79.99',
      image: '/images/products/fitness-tracker.jpg',
      description: 'Slim fitness band with continuous heart rate monitoring, SpO2 tracking, and sleep analysis. Includes 14+ exercise modes and smartphone notifications.'
    },
    {
      id: 6,
      name: 'Portable Speaker',
      price: '$159.99',
      image: '/images/products/speaker.jpg',
      description: 'Powerful 360° wireless speaker with 20W output and deep bass. Features IPX7 waterproofing, 16-hour playtime, and built-in power bank functionality.'
    },
    {
      id: 7,
      name: 'Gaming Mouse',
      price: '$69.99',
      image: '/images/products/gaming-mouse.jpg',
      description: 'High-precision gaming mouse with 16000 DPI optical sensor and programmable buttons. Features customizable RGB lighting and ergonomic design for extended gaming sessions.'
    },
    {
      id: 8,
      name: 'Mechanical Keyboard',
      price: '$139.99',
      image: '/images/products/keyboard.jpg',
      description: 'Premium mechanical keyboard with Cherry MX switches and per-key RGB backlighting. Includes USB pass-through, media controls, and detachable wrist rest.'
    },
    {
      id: 9,
      name: 'Laptop Stand',
      price: '$49.99',
      image: '/images/products/laptop-stand.jpg',
      description: 'Adjustable aluminum laptop stand with ergonomic design for improved posture. Features heat dissipation, cable management, and foldable portable design.'
    },
    {
      id: 10,
      name: 'Wireless Charger',
      price: '$39.99',
      image: '/images/products/wireless-charger.jpg',
      description: '15W fast wireless charging pad compatible with all Qi-enabled devices. Features LED indicator, foreign object detection, and sleek minimalist design.'
    }
  ];

  const [currentPage, setCurrentPage] = React.useState(0);
  const productsPerPage = 5;
  const totalPages = Math.ceil(newProducts.length / productsPerPage);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Add auto-slide functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => 
        prevPage === totalPages - 1 ? 0 : prevPage + 1
      );
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [totalPages]);

  // Pause auto-slide when modal is open
  React.useEffect(() => {
    if (selectedProduct) {
      clearInterval(window.slideInterval);
    } else {
      window.slideInterval = setInterval(() => {
        setCurrentPage((prevPage) => 
          prevPage === totalPages - 1 ? 0 : prevPage + 1
        );
      }, 10000);
    }

    return () => clearInterval(window.slideInterval);
  }, [selectedProduct, totalPages]);

  // Optional: Pause auto-slide when user interacts
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    // Clear existing interval and start a new one
    clearInterval(window.slideInterval);
    window.slideInterval = setInterval(() => {
      setCurrentPage((prevPage) => 
        prevPage === totalPages - 1 ? 0 : prevPage + 1
      );
    }, 10000);
  };

  return (
    <NewArrivalsSection>
      <SectionHeader>
        <SectionTitle>New Arrivals</SectionTitle>
      </SectionHeader>
      <SliderContainer>
        <SliderWrapper>
          <SliderTrack 
            transform={`translateX(calc(-${currentPage * 100}% - ${currentPage * 2}rem))`}
            style={{ 
              backfaceVisibility: 'hidden',
              perspective: 1000
            }}
          >
            {newProducts.map(product => (
              <ProductCard 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
              >
                <ProductImage src={product.image} alt={product.name} />
                <ProductInfo>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>{product.price}</ProductPrice>
                </ProductInfo>
              </ProductCard>
            ))}
          </SliderTrack>
        </SliderWrapper>
        <Indicators>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Indicator
              key={index}
              active={currentPage === index}
              onClick={() => handlePageChange(index)}
            />
          ))}
        </Indicators>
      </SliderContainer>

      <Modal 
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && <ProductDetail product={selectedProduct} />}
      </Modal>
    </NewArrivalsSection>
  );
};

// Add this to fix TypeScript window type
declare global {
  interface Window {
    slideInterval: NodeJS.Timeout;
  }
}

export default NewArrivals; 