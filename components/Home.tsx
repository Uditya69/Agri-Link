import React from 'react';
import Carousel from './Carousel';
import AuctionCarousel from './AuctionCarousel';
import '.././src/css/home.css'
const Home: React.FC = () => {

  return(
    <div className='carousel'>
      <>
      <Carousel/>
      <h2 className='heading'>Live Auctions</h2>
      <AuctionCarousel />
      </>
    </div>
  )
}
export default Home;
