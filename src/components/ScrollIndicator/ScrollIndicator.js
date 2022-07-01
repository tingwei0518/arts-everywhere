import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import Menu from '../Menu';

const Wrapper = styled.div`
  width: 95vw;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 10px;
  margin: 10px 20px;
  position: fixed; 
  bottom: 20px;
  left: 20px;
  z-index: 1;
`;

const MenuBtn = styled.div`
  width: 52px;
  height: 52px;
  background-color: rgb(255, 240, 0);
  margin-right: 16px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Times,sans-serif; 
  color: black;
  cursor: pointer;
  z-index: 4;
`;

const ScrollIndicatorWrapper = styled.div`
  background-color: rgba(0, 0, 0, .5); 
  height: 3px; 
  display: flex;
  align-items: center;
  border-radius: 0 4px 4px 0; 
  width: 100%;
`;

const MainScrollIndicator = styled.div`
  background-color: black; 
  height: 3px; 
  border-radius: 0 4px 4px 0;
`;

const Point = styled.div`
  width: ${(props) => (props.active ? '20px' : '13px')};
  height: ${(props) => (props.active ? '20px' : '13px')};
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  &:not(:first-child){
    div {
      opacity: ${(props) => (props.active ? '1' : '0')};
    }
  }
  &:hover {
    div {
      opacity: 1;
    }
  }
`;

const Title = styled.div`
  width: fit-content;
  text-align: center;
  font-family: Times,sans-serif;
  margin-top: 20px;
  opacity: 0;
`;

function ScrollIndicator({
  isFiltered, scrollToElement, homeRef, filteredInfoRef, filteredEventsRef,
  recentEventsRef, popularEventsRef, userEventsRef, userEventsEditor,
}) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const findActiveIndex = () => {
    if (scrollLeft < 24) {
      setActiveIndex(0);
    } else if (scrollLeft >= 24 && scrollLeft < 32) {
      setActiveIndex(1);
    } else if (scrollLeft >= 32 && scrollLeft < 54) {
      setActiveIndex(2);
    } else if (scrollLeft >= 54 && scrollLeft < 76) {
      setActiveIndex(3);
    } else if (scrollLeft >= 76 && scrollLeft < 99) {
      setActiveIndex(4);
    } else {
      setActiveIndex(5);
    }
  };

  const findFilteredActiveIndex = () => {
    if (scrollLeft < 20) {
      setActiveIndex(0);
    } else if (scrollLeft >= 20 && scrollLeft < 26) {
      setActiveIndex(1);
    } else if (scrollLeft >= 26 && scrollLeft < 44) {
      setActiveIndex(2);
    } else if (scrollLeft >= 44 && scrollLeft < 63) {
      setActiveIndex(3);
    } else if (scrollLeft >= 63 && scrollLeft < 81) {
      setActiveIndex(4);
    } else if (scrollLeft >= 81 && scrollLeft < 99) {
      setActiveIndex(5);
    } else {
      setActiveIndex(6);
    }
  };

  const onScroll = () => {
    const winScroll = document.documentElement.scrollLeft;
    const width = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const scrolled = (winScroll / width) * 100;
    setScrollLeft(scrolled);
  };

  useEffect(() => {
    if (isFiltered) {
      findFilteredActiveIndex();
    } else {
      findActiveIndex();
    }
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLeft]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <MenuBtn onClick={() => setIsOpen(!isOpen)}>
        {
          isOpen
            ? 'Close' : 'Menu'
        }
      </MenuBtn>
      <Menu isOpen={isOpen} setIsOpen={setIsOpen} />
      <ScrollIndicatorWrapper>
        <Point active={activeIndex === 0} onClick={() => scrollToElement(homeRef)}>
          <Title>Home</Title>
        </Point>
        {
          isFiltered ? (
            <>
              <Point style={{ position: 'absolute', left: '24%' }} active={activeIndex === 1} onClick={() => scrollToElement(filteredInfoRef)}>
                <Title>Search Results</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '30%' }} active={activeIndex === 2} onClick={() => scrollToElement(filteredEventsRef)}>
                <Title>Filtered Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '48%' }} active={activeIndex === 3} onClick={() => scrollToElement(recentEventsRef)}>
                <Title>Recent Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '65%' }} active={activeIndex === 4} onClick={() => scrollToElement(popularEventsRef)}>
                <Title>Popular Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '83%' }} active={activeIndex === 5} onClick={() => scrollToElement(userEventsRef)}>
                <Title>Member Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '99%' }} active={activeIndex === 6} onClick={() => scrollToElement(userEventsEditor)}>
                <Title>Post Event</Title>
              </Point>
            </>
          ) : (
            <>
              <Point style={{ position: 'absolute', left: '28%' }} active={activeIndex === 1} onClick={() => scrollToElement(filteredInfoRef)}>
                <Title>Search Results</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '36%' }} active={activeIndex === 2} onClick={() => scrollToElement(recentEventsRef)}>
                <Title>Recent Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '57%' }} active={activeIndex === 3} onClick={() => scrollToElement(popularEventsRef)}>
                <Title>Popular Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '78%' }} active={activeIndex === 4} onClick={() => scrollToElement(userEventsRef)}>
                <Title>Member Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '99%' }} active={activeIndex === 5} onClick={() => scrollToElement(userEventsEditor)}>
                <Title>Post Event</Title>
              </Point>
            </>
          )
        }
        <MainScrollIndicator style={{ width: `${scrollLeft}%` }} />
      </ScrollIndicatorWrapper>
    </Wrapper>
  );
}

ScrollIndicator.propTypes = {
  isFiltered: PropTypes.bool.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  homeRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  filteredInfoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  filteredEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  recentEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  popularEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  userEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  userEventsEditor: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

export default ScrollIndicator;
