import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

const ScrollIndicatorWraper = styled.div`
  background-color: rgba(0, 0, 0, .5); 
  height: 5px; 
  border-radius: 4px; 
  width: 97%; 
  position: fixed; 
  bottom: 20px;
  left: 20px;
  z-index: 1;
`;

const MainScrollIndicator = styled.div`
  background-color: black; 
  height: 5px; 
  border-radius: 4px;
`;

function ScrollIndicator() {
  const [scrollLeft, setScrollLeft] = useState(0);

  const onScroll = () => {
    const winScroll = document.documentElement.scrollLeft;
    const width = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const scrolled = (winScroll / width) * 100;
    setScrollLeft(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ScrollIndicatorWraper>
      <MainScrollIndicator style={{ width: `${scrollLeft}%` }} />
    </ScrollIndicatorWraper>
  );
}

export default ScrollIndicator;
