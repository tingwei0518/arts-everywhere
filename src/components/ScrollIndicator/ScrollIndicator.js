import { useState, useEffect } from 'react';
import {
  doc, collection, setDoc, updateDoc, query, onSnapshot, where, limit,
} from 'firebase/firestore';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { db } from '../../utils/firebaseInit';
import Menu from '../Menu';
// import UserContext from '../../UserContext';

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
  z-index: 5;
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

const UserMarker = styled.div`
  background-color: #FFD700;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
`;

const Title = styled.div`
  width: fit-content;
  text-align: center;
  font-family: Times,sans-serif;
  margin-top: 20px;
  opacity: 0;
`;

// context user id
// onAuthChanged
// login

function ScrollIndicator({
  isFiltered, scrollToElement, homeRef, filteredInfoRef, filteredEventsRef,
  recentEventsRef, popularEventsRef, userEventsRef, userEventsEditorRef,
}) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [multipleUserPosition, setMultipleUserPosition] = useState([]);
  // console.log('multipleUserPosition', multipleUserPosition);
  const [currentUserId, setCurrentUserId] = useState();
  // const currentUser = useContext(UserContext);
  // console.log(currentUser.userId);

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

  function debounce(func, delay = 3000) {
    let timer = null;

    return () => {
      const context = this;
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;

      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

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

  useEffect(() => {
    const getUserPosition = () => {
      const winScroll = document.documentElement.scrollLeft;
      const width = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const scrolled = (winScroll / width) * 100;
      if (currentUserId) {
        const userPositionRef = doc(db, 'userPosition', currentUserId);
        updateDoc(userPositionRef, {
          position: scrolled,
          isActive: true,
          userId: currentUserId,
        });
      } else {
        const data = doc(collection(db, 'userPosition'));
        setCurrentUserId(data.id);
        setDoc(data, {
          isActive: true,
          position: scrolled,
          userId: data.id,
        });
      }
    };
    const debounceGetUserPosition = debounce(getUserPosition);
    window.addEventListener('scroll', debounceGetUserPosition);
    return () => {
      window.removeEventListener('scroll', debounceGetUserPosition);
    };
    // }, [currentUserId]);
  }, [currentUserId]);

  useEffect(() => {
    const userPositionRef = query(collection(db, 'userPosition'), where('isActive', '==', true), limit(9));
    const unsubscribe = onSnapshot(userPositionRef, (querySnapshot) => {
      const userPositionData = [];
      querySnapshot.forEach((posDoc) => {
        if (currentUserId !== posDoc.data().userId) {
          userPositionData.push(posDoc.data());
        }
      });
      console.log('userPositionData', userPositionData);
      setMultipleUserPosition(userPositionData);
    });
    return unsubscribe;
    // }, [currentUserId]);
  }, [currentUserId]);

  useEffect(() => {
    const handleBeforeunload = () => {
      const userPositionRef = doc(db, 'userPosition', currentUserId);
      updateDoc(userPositionRef, {
        isActive: false,
      });
    };
    window.addEventListener('beforeunload', handleBeforeunload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
    // }, [currentUserId]);
  }, [currentUserId]);

  useEffect(() => () => {
    const userPositionRef = doc(db, 'userPosition', currentUserId);
    updateDoc(userPositionRef, {
      isActive: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <MenuBtn
        onClick={() => setIsOpen(!isOpen)}
      >
        {
          isOpen
            ? 'Close' : 'Menu'
        }
      </MenuBtn>
      <Menu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isFiltered={isFiltered}
        scrollToElement={scrollToElement}
        homeRef={homeRef}
        filteredInfoRef={filteredInfoRef}
        filteredEventsRef={filteredEventsRef}
        recentEventsRef={recentEventsRef}
        popularEventsRef={popularEventsRef}
        userEventsRef={userEventsRef}
        userEventsEditorRef={userEventsEditorRef}
      />
      <ScrollIndicatorWrapper>
        <Point style={{ zIndex: '3' }} active={activeIndex === 0} onClick={() => scrollToElement(homeRef)}>
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
              <Point style={{ position: 'absolute', left: '99%' }} active={activeIndex === 6} onClick={() => scrollToElement(userEventsEditorRef)}>
                <Title>Post Event</Title>
              </Point>
              {
                multipleUserPosition?.map((userPos) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <UserMarker key={userPos.userId} style={{ position: 'absolute', left: `${userPos.position}%` }} />
                ))
              }
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
              <Point style={{ position: 'absolute', left: '99%' }} active={activeIndex === 5} onClick={() => scrollToElement(userEventsEditorRef)}>
                <Title>Post Event</Title>
              </Point>
              {
                multipleUserPosition?.map((userPos) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <UserMarker key={userPos.userId} style={{ position: 'absolute', left: `${userPos.position}%` }} />
                ))
              }
            </>
          )
        }
        <MainScrollIndicator style={{ width: `${scrollLeft}%` }} />
        <UserMarker />
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
  userEventsEditorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

export default ScrollIndicator;
