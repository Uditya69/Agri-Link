import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import '../src/css/carousel.css'; // Import the custom CSS

interface Slide {
  id: number;
  content: JSX.Element;
}

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // To control auto-slide when user hovers
  const navigate = useNavigate();

  // Define your slides with custom components
  const slides: Slide[] = [
    {
      id: 1,
      content: (
        <div className="carousel-slide-content">
        
          <h3>To see the weather updates now</h3>
          <button className="btn" onClick={() => navigate('/weather')}>
            Click Here
          </button>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="carousel-slide-content">
          <p>This is the second slide with different custom content.</p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="carousel-slide-content">
          <p>This is the third slide with more custom content.</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...handlers}
    >
      <div className="carousel-slides">
        {slides[currentIndex].content}
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
