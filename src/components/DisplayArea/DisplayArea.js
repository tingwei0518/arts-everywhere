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
`;

const PageTitle = styled.div`
  font-size: 6rem;
  font-family: Times,sans-serif; 
  padding: 40px 10px 0 60px;
  color: ${(props) => (props.color)};
`;

const EventSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
`;

const SectionText = styled.div`
  width: 320px;
  white-space: normal;
  padding-left: 70px;
  padding-top: 20px;
  line-height: 1.8;
  color: ${(props) => (props.color)};
`;

const Events = styled.div`
  width: 900px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 35px;
`;

const Event = styled.div`
  margin-top: 20px;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  &:first-child {
    margin-left: 0;
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
`;

const EventTitle = styled.div`
  width: 180px;
  font-size: .95rem;
  font-weight: bold;
  white-space: normal;
  display: inline-block;
`;
const EventDate = styled.div`
  font-size: .8rem;
`;
const EventTag = styled.div`
  font-size: .8rem;
`;

function DisplayArea({
  title, color, scrolled, text, events, primary, showUid, setShowUid, member, popular,
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
          currentIndex >= 3
            ? (
              <img
                onClick={prevBatch}
                src={prev}
                alt="previous page"
                aria-hidden="true"
                style={{
                  width: '45px', height: '45px', marginTop: '200px', marginLeft: '20px', cursor: 'pointer',
                }}
              />
            ) : <div style={{ width: '45px', height: '45px', marginLeft: '20px' }} />
        }
        <Events>
          {
            events?.slice(currentIndex, currentIndex + 3).map((event, index) => (
              <Event>
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
                        <img
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          src={event.imageUrl
                            ? event.imageUrl : eventImageProps[Number(event.category)][index % 3]}
                          alt={event.title}
                          aria-hidden="true"
                          onClick={() => setShowUid(event.UID)}
                          style={{
                            boxSizing: 'content-box', width: '200px', height: '200px', objectFit: 'cover', marginBottom: '30px', cursor: 'pointer', border: '25px solid white', boxShadow: '12px 12px rgba(0, 0, 0, .5)',
                          }}
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
        </Events>
        {
          currentIndex <= events.length - 4
            ? (
              <img
                onClick={nextBatch}
                src={next}
                alt="next batch"
                aria-hidden="true"
                style={{
                  width: '45px', height: '45px', marginTop: '200px', cursor: 'pointer',
                }}
              />
            ) : <div style={{ width: '45px', height: '45px' }} />
        }
        {
          events?.map((event, index) => (
            showUid === event.UID
            && (
              <EventModal
                event={event}
                setShowUid={setShowUid}
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
};

export default DisplayArea;
