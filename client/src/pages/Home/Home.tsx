import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '../../components/common/Footer/Footer';
import NewArrivals from '../../components/sections/NewArrivals';
import Newsletter from '../../components/sections/Newsletter';

const HeroSection = styled.div`
  height: 80vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url('/images/homepage.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const CTAButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff8533;
  }
`;

const FeaturedSection = styled.section`
  background-color: #f5f5f5;
  width: 100%;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;
`;

const CarouselContainer = styled.div`
  width: calc(100% - 80px);
  margin: 0 auto;
  padding: 20px 0;
  position: relative;

  .slick-prev, .slick-next {
    width: 40px;
    height: 40px;
    z-index: 1;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    &:before {
      font-size: 40px;
      color: #ff6b00;
    }
  }

  .slick-prev {
    left: -40px;
  }

  .slick-next {
    right: -40px;
  }

  .slick-list {
    margin: 0;
  }

  .slick-slide {
    padding: 0 10px;
  }

  .slick-track {
    display: flex;
    align-items: center;
  }
`;

const CategoryCard = styled.div`
  position: relative;
  height: 400px;
  width: 240px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: #f5f5f5;
`;

const CategoryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const CategoryDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const Home: React.FC = () => {
  const categories = [
    {
      id: 1,
      title: 'Fashion Essentials',
      description: 'Discover our latest collection of minimalist clothing',
      image: '/images/clothes-on-chair.jpg',
    },
    {
      id: 2,
      title: 'Fresh Produce',
      description: 'Handpicked seasonal fruits and vegetables',
      image: '/images/fruits-tangerine.jpg',
    },
    {
      id: 3,
      title: 'Home & Living',
      description: 'Modern furniture for contemporary living',
      image: '/images/furniture.jpg',
    },
    {
      id: 4,
      title: 'Electronics',
      description: 'Latest gadgets and smart devices',
      image: '/images/electronics.jpg',
    },
    {
      id: 5,
      title: 'Beauty & Care',
      description: 'Premium skincare and beauty products',
      image: '/images/beauty-and-care.jpg',
    },
    {
      id: 6,
      title: 'Sports & Fitness',
      description: 'Equipment for your active lifestyle',
      image: '/images/fitness.jpg',
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div>
      <HeroSection>
        <HeroContent>
          <Title>Welcome to ShopVerse</Title>
          <Subtitle>Discover amazing products at incredible prices</Subtitle>
          <CTAButton>Shop Now</CTAButton>
        </HeroContent>
      </HeroSection>
      
      <FeaturedSection>
        <CarouselContainer>
          <Slider {...sliderSettings}>
            {categories.map((category) => (
              <CategoryCard key={category.id}>
                <CategoryImage src={category.image} alt={category.title} />
                <CategoryOverlay>
                  <CategoryTitle>{category.title}</CategoryTitle>
                  <CategoryDescription>{category.description}</CategoryDescription>
                </CategoryOverlay>
              </CategoryCard>
            ))}
          </Slider>
        </CarouselContainer>
      </FeaturedSection>
      <NewArrivals />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home; 