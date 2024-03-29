import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components/macro';
import PropTypes from 'prop-types';
import EventModal from '../EventModal';
import next from '../../images/next.png';
import prev from '../../images/prev.png';
import image11 from '../../assets/1-1.jpg';
import image12 from '../../assets/1-2.jpg';
import image13 from '../../assets/1-3.jpg';
import image21 from '../../assets/2-1.jpg';
import image22 from '../../assets/2-2.jpg';
import image23 from '../../assets/2-3.jpg';
import image31 from '../../assets/3-1.jpg';
import image32 from '../../assets/3-2.jpg';
import image41 from '../../assets/4-1.jpg';
import image42 from '../../assets/4-2.jpg';
import image51 from '../../assets/5-1.jpg';
import image52 from '../../assets/5-2.jpg';
import image61 from '../../assets/6-1.jpg';
import image62 from '../../assets/6-2.jpg';
import image63 from '../../assets/6-3.jpg';
import image71 from '../../assets/7-1.jpg';
import image72 from '../../assets/7-2.jpg';
import image73 from '../../assets/7-3.jpg';
import image81 from '../../assets/8-1.jpg';
import image82 from '../../assets/8-2.jpg';
import image83 from '../../assets/8-3.jpg';
import image17 from '../../assets/17-1.jpg';
import imageOther1 from '../../assets/o1.jpg';
import imageOther2 from '../../assets/o2.jpg';
import imageOther3 from '../../assets/o3.jpg';

const eventCategory = {
  1: '音樂', 2: '戲劇', 3: '舞蹈', 4: '親子', 5: '獨立音樂', 6: '展覽', 7: '講座', 8: '電影', 9: '其他', 10: '其他', 11: '綜藝', 12: '其他', 13: '競賽', 14: '徵選', 15: '其他', 16: '其他', 17: '演唱會', 18: '其他', 19: '研習課程',
};
const eventImageProps = {
  1: [image11, image12, image13],
  2: [image21, image22, image23],
  3: [image31, image32, image31],
  4: [image41, image42, image41],
  5: [image51, image52, image51],
  6: [image61, image62, image63],
  7: [image71, image72, image73],
  8: [image81, image82, image83],
  9: [imageOther1, imageOther2, imageOther3],
  10: [imageOther1, imageOther2, imageOther3],
  11: [imageOther1, imageOther2, imageOther3],
  12: [imageOther1, imageOther2, imageOther3],
  13: [imageOther1, imageOther2, imageOther3],
  14: [imageOther1, imageOther2, imageOther3],
  15: [imageOther1, imageOther2, imageOther3],
  16: [imageOther1, imageOther2, imageOther3],
  17: [image17, image17, image17],
  18: [imageOther1, imageOther2, imageOther3],
  19: [imageOther1, imageOther2, imageOther3],
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const PageTitle = styled.div`
  font-size: 6rem;
  font-family: Times,sans-serif; 
  padding: 40px 10px 0 60px;
  color: ${(props) => (props.color)};

  @media screen and (max-width: 450px) {
    width: fit-content;
    font-size: 3rem;
    padding: 40px 0 0 0;
  }
`;

const Reminder = styled.div`
  margin: 50px 0 0 150px;
  font-size: 1rem;
  line-height: 1.8;
  color: ${(props) => (props.color)};

  @media screen and (max-width: 450px) {
    width: 320px;
    white-space: normal;
    margin: 50px 0 0 0;
  }
`;

const EventSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;

  @media screen and (max-width: 450px) {
    flex-direction: column;
  }
`;

const SectionText = styled.div`
  width: 320px;
  white-space: normal;
  padding-left: 70px;
  padding-top: 20px;
  line-height: 1.8;
  color: ${(props) => (props.color)};

  @media screen and (max-width: 450px) {
    font-size: .8rem;
    width: 250px;
    height: 75px;
    padding-left: 0;
  }
`;

const Events = styled.div`
  width: 900px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 35px;

  @media screen and (max-width: 450px) {
    flex-direction: column;
    width: fit-content;
    padding: 0;
  }
`;

const PrevBatch = styled.img`
  width: 45px;
  height: 45px;
  margin-top: 200px;
  margin-left: 20px;
  cursor: pointer;
`;

const NextBatch = styled.img`
  width: 45px;
  height: 45px;
  margin-top: 200px;
  cursor: pointer;
`;

const MobileBatchBtns = styled.div`
  margin: 20px auto 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const MobilePrevBatch = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const MobileNextBatch = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const EmptyBatch = styled.div`
  width: 45px;
  height: 45px;

  @media screen and (max-width: 450px) {
    width: 25px;
    height: 25px;
  }
`;

const Event = styled.div`
  margin-top: 20px;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  &:first-child {
    margin-left: 0;
  }

  @media screen and (max-width: 450px) {
    position: relative;
    flex-direction: row;
    margin-left: 0px;
  }
`;

const shine = keyframes`
  0%   {opacity: 0}
  100% {opacity: 1}
`;

const animation = (props) => css`
  ${shine} ${props.animationLength} linear 3s infinite;
`;

const HitRate = styled.div`
  color: #324E8E;
  font-size: 1.1rem;
  font-weight: bold;
  align-self: center;
  margin: -39px 0 15px 0;
  animation: ${animation};

  @media screen and (max-width: 450px) {
    font-size: .7rem;
    position: absolute;
    top: 20px;
    right: 0;
    color: red;
  }
`;

const MemberEventImg = styled.img`
  box-sizing: content-box;
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-bottom: 30px;
  cursor: pointer;
  border: 25px solid white;
  box-shadow: 12px 12px rgba(0, 0, 0, .5);

  @media screen and (max-width: 450px) {
    width: 90px;
    height: 90px;
    border: 5px solid white;
    box-shadow: none;
    margin-bottom: 0px;
  }
`;

const EventImg = styled.div`
  box-sizing: content-box;
  width: 200px;
  height: 200px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: 25px solid ${(props) => (props.primary ? 'lightgrey' : 'white')};
  box-shadow: 12px 12px ${(props) => (props.primary ? 'rgba(255, 241, 116, .8)' : 'rgba(0, 0, 0, .5)')};
  margin-bottom: 30px;
  cursor: pointer;

  @media screen and (max-width: 450px) {
    width: 90px;
    height: 90px;
    font-size: .8rem;
    border: 5px solid ${(props) => (props.primary ? 'lightgrey' : 'white')};
    box-shadow: none;
    margin-bottom: 0px;
  }
`;

const EventCard = styled.div`
  width: 200px;
  height: 120px;
  background-color: ${(props) => (props.primary ? 'lightgrey' : 'white')};
  box-shadow: 9px 9px ${(props) => (props.primary ? 'rgba(255, 241, 116, .8)' : 'rgba(0, 0, 0, .2)')};
  padding: 8px;
  cursor: pointer;
  & a {
    text-decoration: none;
    color: black;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media screen and (max-width: 450px) {
    width: 200px;
    height: 100px;
    box-shadow: none;
  }
`;

const EventTitle = styled.div`
  width: 180px;
  font-size: .95rem;
  font-weight: bold;
  white-space: normal;
  display: inline-block;

  @media screen and (max-width: 450px) {
    font-size: .85rem;
  }
`;

const EventDate = styled.div`
  font-size: .8rem;
`;

const EventTag = styled.div`
  font-size: .8rem;
`;

function DisplayArea({
  title, color, scrolled, text, events, primary, showUid,
  setShowUid, member, popular, isMobileScreen,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextBatch = () => {
    setCurrentIndex((prevCurrentIndex) => prevCurrentIndex + 3);
  };

  const prevBatch = () => {
    setCurrentIndex((prevCurrentIndex) => prevCurrentIndex - 3);
  };

  return (
    <Wrapper>
      <PageTitle primary={primary} color={color}>{title}</PageTitle>
      <EventSection>
        <SectionText primary={primary} color={color}>{text}</SectionText>
        {
          !isMobileScreen
          && (
            currentIndex >= 3
              ? (
                <PrevBatch
                  onClick={prevBatch}
                  src={prev}
                  alt="previous page"
                  aria-hidden="true"
                />
              ) : <EmptyBatch />
          )
        }
        <Events>
          {
            events.length === 0
            && (
              <Reminder color={color}>
                抱歉！
                <br />
                此時間/地點範圍內暫時沒有搜尋到藝文活動，請搜尋其他區間，謝謝！
              </Reminder>
            )
          }
          {
            events?.slice(currentIndex, currentIndex + 3).map((event, index) => (
              <Event key={event.UID}>
                {
                  popular
                  && (
                    <HitRate>
                      ＼＼
                      {' '}
                      {event.hitRate}
                      {' '}
                      hit rate
                      {' '}
                      ／／
                    </HitRate>
                  )
                }
                <Link to={`?id=${event.UID}`}>
                  {
                    member
                      ? (
                        <MemberEventImg
                          // key={index}
                          src={event.imageUrl
                            ? event.imageUrl : eventImageProps[Number(event.category)][index % 3]}
                          alt={event.title}
                          aria-hidden="true"
                          onClick={() => setShowUid(event.UID)}
                        />
                      ) : (
                        <EventImg
                          src={event.imageUrl
                            ? event.imageUrl : eventImageProps[Number(event.category)][index % 3]}
                          onClick={() => setShowUid(event.UID)}
                          primary={primary}
                        />
                      )
                  }
                </Link>
                <EventCard primary={primary} onClick={() => setShowUid(event.UID)}>
                  <Link to={`?id=${event.UID}`}>
                    {popular}
                    <EventTag>
                      {eventCategory[Number(event.category)]}
                    </EventTag>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDate>
                      {event.startDate}
                      {' '}
                      -
                      {' '}
                      {event.endDate}
                    </EventDate>
                  </Link>
                </EventCard>
                <EventModal
                  event={event}
                  setShowUid={setShowUid}
                  member={member}
                  idx={index}
                  show={showUid === event.UID}
                  scrolled={scrolled}
                />
              </Event>
            ))
          }
          {
            isMobileScreen
            && (
              <MobileBatchBtns>
                {
                  currentIndex >= 3
                    ? (
                      <MobilePrevBatch src={prev} alt="previous page" onClick={prevBatch} />
                    ) : <EmptyBatch />
                }
                {
                  currentIndex <= events.length - 4
                    ? (
                      <MobileNextBatch src={next} alt="next page" onClick={nextBatch} />
                    ) : <EmptyBatch />
                }
              </MobileBatchBtns>
            )
          }
        </Events>
        {
          !isMobileScreen
          && (
            currentIndex <= events.length - 4
              ? (
                <NextBatch
                  onClick={nextBatch}
                  src={next}
                  alt="next batch"
                  aria-hidden="true"
                />
              ) : <EmptyBatch />
          )
        }
        {
          events?.map((event, index) => (
            showUid === event.UID
            && (
              <EventModal
                key={index}
                event={event}
                setShowUid={setShowUid}
                show={showUid === event.UID}
                member={member}
                idx={index}
                scrolled={scrolled}
              />
            )
          ))
        }
      </EventSection>
    </Wrapper>
  );
}

DisplayArea.propTypes = {
  title: PropTypes.string.isRequired,
  scrolled: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({
    showInfo: PropTypes.arrayOf(PropTypes.shape({
      endTime: PropTypes.string,
      latitude: PropTypes.string,
      location: PropTypes.string,
      locationName: PropTypes.string,
      longitude: PropTypes.string,
      onSales: PropTypes.string,
      price: PropTypes.string,
      time: PropTypes.string,
    })),
    version: PropTypes.string,
    UID: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    showUnit: PropTypes.string,
    discountInfo: PropTypes.string,
    descriptionFilterHtml: PropTypes.string,
    imageUrl: PropTypes.string,
    masterUnit: PropTypes.arrayOf(PropTypes.string),
    subUnit: PropTypes.arrayOf(PropTypes.string),
    supportUnit: PropTypes.arrayOf(PropTypes.string),
    otherUnit: PropTypes.arrayOf(PropTypes.string),
    webSales: PropTypes.string,
    sourceWebPromote: PropTypes.string,
    comment: PropTypes.string,
    editModifyDate: PropTypes.string,
    sourceWebName: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    hitRate: PropTypes.number,
    keywords: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  primary: PropTypes.bool.isRequired,
  showUid: PropTypes.string.isRequired,
  setShowUid: PropTypes.func.isRequired,
  member: PropTypes.bool.isRequired,
  popular: PropTypes.bool.isRequired,
  isMobileScreen: PropTypes.bool.isRequired,
};

export default DisplayArea;
