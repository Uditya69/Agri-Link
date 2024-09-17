import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '.././src/css/carousel.css'; // Import the custom CSS

interface Slide {
  id: number;
  content: JSX.Element;
}

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define your slides with custom components
  const navigate = useNavigate();

const handleClick = () => {
navigate('/weather');
};
  const slides: Slide[] = [
    {
      id: 1,
      content: (
        <div className="carousel-slide-content">
          <h3>To see the weather updates now</h3>
      <button className="btn" onClick={handleClick}>
        Click Here
      </button>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="carousel-slide-content">
          <h2>Second Slide</h2>
          <p>This is the second slide with different custom content.</p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="carousel-slide-content">
          <h2>Third Slide</h2>
          <p>This is the third slide with more custom content.</p>
        </div>
      ),
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel-container">
      <button className="carousel-button prev" onClick={handlePrev}>
        &#10094;
      </button>
      <div className="carousel-slides">
        {slides[currentIndex].content}
      </div>
      <button className="carousel-button next" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
