import { useState, useEffect, useContext } from 'react';
import {
  collection, query, onSnapshot, where, limit,
} from 'firebase/firestore';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { db } from '../../utils/firebaseInit';
import Menu from '../Menu';
import UserContext from '../../UserContext';
import face1 from '../../images/face1.svg';
import face2 from '../../images/face2.svg';
import face3 from '../../images/face3.svg';
import face4 from '../../images/face4.svg';
import face5 from '../../images/face5.svg';
import back1 from '../../images/back1.svg';
import back2 from '../../images/back2.svg';
import back3 from '../../images/back3.svg';
import back4 from '../../images/back4.svg';
import back5 from '../../images/back5.svg';

const userBackProps = {
  0: back1,
  1: back2,
  2: back3,
  3: back4,
  4: back5,
};

const userFaceProps = {
  0: face1,
  1: face2,
  2: face3,
  3: face4,
  4: face5,
};

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
  position: relative;
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
  transition: width .5s ease-out;
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
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  width: 55px;
  height: 55px;
  margin: -58px 0 0 -20px;
  transition: left .8s linear;
  z-index: 1;
  div {
    opacity: 0;
  }
  :hover {
    background-image: url(${(props) => props.face});
    div {
      width: 105px;
      margin: -20px 0 0 -27px;
      padding: 2px;
      background-color: rgb(255, 240, 0);
      border: 1px solid rgb(255, 240, 0);
      border-radius: 2px;
      text-align: center;
      font-size: .7rem;
      opacity: 1;
    }
  }
`;

const Test = styled.div`
  width: 50px;
  height: 60px;
  margin-left: -10px;
  background-image: url(${face1});
  background-size: contain;
  background-repeat: no-repeat;
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

function ScrollIndicator({
  isFiltered, scrolled, setScrolled, containerRef, currentUserId,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [multipleUserPosition, setMultipleUserPosition] = useState([]);
  const currentMember = useContext(UserContext);
  const layoutWidth = containerRef?.current?.offsetWidth ?? window.innerWidth;
  const scrollLeft = (
    scrolled / Math.max(layoutWidth - window.innerWidth, window.innerWidth)
  ) * 100;

  const userPositionText = (distance) => {
    if (isFiltered) {
      if (distance < 20) {
        return '我想搜尋藝文活動';
      }
      if (distance >= 20 && distance < 26) {
        return '搜尋到好多活動';
      }
      if (distance >= 26 && distance < 44) {
        return '看看搜尋結果！';
      }
      if (distance >= 44 && distance < 63) {
        return '這週有這些活動耶';
      }
      if (distance >= 63 && distance < 81) {
        return '好熱門！我要去！';
      }
      if (distance >= 81 && distance < 99) {
        return '會員po的活動好讚';
      }
      if (distance >= 99) {
        return '我想刊登活動';
      }
      return '我想搜尋藝文活動';
    }
    if (distance < 24) {
      return '我想搜尋藝文活動';
    }
    if (distance >= 24 && distance < 32) {
      return '搜尋到好多活動';
    }
    if (distance >= 32 && distance < 54) {
      return '這週有這些活動耶';
    }
    if (distance >= 54 && distance < 76) {
      return '好熱門！我要去！';
    }
    if (distance >= 76 && distance < 99) {
      return '會員po的活動好讚';
    }
    if (distance >= 99) {
      return '我想刊登活動';
    }
    return '我想搜尋藝文活動';
  };

  const findActiveIndex = () => {
    if (scrollLeft < 22) {
      setActiveIndex(0);
    } else if (scrollLeft >= 22 && scrollLeft < 31) {
      setActiveIndex(1);
    } else if (scrollLeft >= 31 && scrollLeft < 54) {
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
  }, [scrolled]);

  useEffect(() => {
    const userPositionRef = query(collection(db, 'userPosition'), where('isActive', '==', true), limit(9));
    const unsubscribe = onSnapshot(userPositionRef, (querySnapshot) => {
      const userPositionData = [];
      querySnapshot.forEach((posDoc) => {
        if (currentUserId !== posDoc.data().userId) {
          userPositionData.push(posDoc.data());
        }
      });
      setMultipleUserPosition(userPositionData);
    });
    return unsubscribe;
  }, [currentUserId]);

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
        setScrolled={setScrolled}
      />
      <ScrollIndicatorWrapper>
        <Point style={{ zIndex: '3' }} active={activeIndex === 0} onClick={() => setScrolled(0)}>
          <Title>Home</Title>
        </Point>
        {
          isFiltered ? (
            <>
              <Point style={{ position: 'absolute', left: '22%' }} active={activeIndex === 1} onClick={() => setScrolled(1450)}>
                <Title>Search Results</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '30%' }} active={activeIndex === 2} onClick={() => setScrolled(1960)}>
                <Title>Filtered Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '48%' }} active={activeIndex === 3} onClick={() => setScrolled(3320)}>
                <Title>Recent Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '65%' }} active={activeIndex === 4} onClick={() => setScrolled(4680)}>
                <Title>Popular Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '83%' }} active={activeIndex === 5} onClick={() => setScrolled(6040)}>
                <Title>Member Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '99%' }} active={activeIndex === 6} onClick={() => setScrolled(7400)}>
                <Title>Post Event</Title>
              </Point>
              {
                multipleUserPosition?.map((userPos, index) => (
                  <UserMarker
                    src={userBackProps[index]}
                    key={userPos.userId}
                    face={userFaceProps[index % 5]}
                    style={{ position: 'absolute', left: `${(userPos.position / Math.max(layoutWidth - window.innerWidth, window.innerWidth)) * 100}%` }}
                  >
                    <div>
                      {userPositionText((userPos.position
                        / Math.max(layoutWidth - window.innerWidth, window.innerWidth)) * 100)}
                    </div>
                  </UserMarker>
                ))
              }
            </>
          ) : (
            <>
              <Point style={{ position: 'absolute', left: '26%' }} active={activeIndex === 1} onClick={() => setScrolled(1450)}>
                <Title>Search Results</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '34%' }} active={activeIndex === 2} onClick={() => setScrolled(1960)}>
                <Title>Recent Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '57%' }} active={activeIndex === 3} onClick={() => setScrolled(3320)}>
                <Title>Popular Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '78%' }} active={activeIndex === 4} onClick={() => setScrolled(4680)}>
                <Title>Member Events</Title>
              </Point>
              <Point style={{ position: 'absolute', left: '99%' }} active={activeIndex === 5} onClick={() => setScrolled(6040)}>
                <Title>Post Event</Title>
              </Point>
              {
                multipleUserPosition?.map((userPos, index) => (
                  <UserMarker
                    src={userBackProps[index % 5]}
                    face={userFaceProps[index % 5]}
                    key={userPos.userId}
                    style={{ position: 'absolute', left: `${(userPos.position / Math.max(layoutWidth - window.innerWidth, window.innerWidth)) * 100}%` }}
                  >
                    <div>
                      {userPositionText((userPos.position
                        / Math.max(layoutWidth - window.innerWidth, window.innerWidth)) * 100)}
                    </div>
                  </UserMarker>
                ))
              }
            </>
          )
        }
        <MainScrollIndicator style={{ width: `${scrollLeft}%` }} />
        <Test member={currentMember.userId !== ''} />
      </ScrollIndicatorWrapper>
    </Wrapper>
  );
}

ScrollIndicator.propTypes = {
  isFiltered: PropTypes.bool.isRequired,
  scrolled: PropTypes.number.isRequired,
  setScrolled: PropTypes.func.isRequired,
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default ScrollIndicator;
