import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import EventModal from '../EventModal';
import next from '../../images/next.png';
import prev from '../../images/prev.png';
import image1 from '../../assets/1-4.jpg';
import image2 from '../../assets/2-3.jpg';
import image3 from '../../assets/3-1.jpg';
import image4 from '../../assets/4-1.jpg';
import image5 from '../../assets/5-1.jpg';
import image6 from '../../assets/6-1.jpg';
import image7 from '../../assets/7-1.jpg';
import image8 from '../../assets/8-1.jpg';
import image17 from '../../assets/17-1.jpg';
import imageOther from '../../assets/1-2.jpg';

const eventCategory = {
  1: '音樂', 2: '戲劇', 3: '舞蹈', 4: '親子', 5: '獨立音樂', 6: '展覽', 7: '講座', 8: '電影', 11: '綜藝', 13: '競賽', 14: '徵選', 15: '其他', 17: '演唱會', 19: '研習課程',
};
const eventImageProps = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
  6: image6,
  7: image7,
  8: image8,
  11: imageOther,
  13: imageOther,
  14: imageOther,
  15: imageOther,
  17: image17,
  19: imageOther,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageTitle = styled.div`
  font-size: 6rem;
  font-family: Times,sans-serif; 
  padding: 40px 10px 0 60px;
  color: ${(props) => (props.primary ? 'darkgrey' : 'white')};
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
  color: ${(props) => (props.primary ? 'darkgrey' : 'white')};
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
  &:first-child {
    margin-left: 0;
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
  font-size: .9rem;
  font-weight: bold;
  white-space: normal;
  display: inline-block;
`;
const EventDate = styled.div`
  font-size: .5rem;
`;
const EventTag = styled.div`
  font-size: .5rem;
`;

function DisplayArea({
  title, text, events, primary, showUid, setShowUid, location,
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
      <PageTitle primary={primary}>{title}</PageTitle>
      <EventSection>
        <SectionText primary={primary}>{text}</SectionText>
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
            events.slice(currentIndex, currentIndex + 3).map((event) => (
              <Event>
                <Link to={`?id=${event.UID}`}>
                  <EventImg
                    src={event.imageUrl ? event.imageUrl : eventImageProps[Number(event.category)]}
                    onClick={() => setShowUid(event.UID)}
                    primary={primary}
                  />
                </Link>
                <EventCard primary={primary} onClick={() => setShowUid(event.UID)}>
                  <Link to={`?id=${event.UID}`}>
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
                {
                  showUid === event.UID
                  && (
                    <EventModal
                      event={event}
                      setShowUid={setShowUid}
                      location={location}
                    />
                  )
                }
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
      </EventSection>
    </Wrapper>
  );
}

DisplayArea.propTypes = {
  title: PropTypes.string.isRequired,
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
  location: PropTypes.string.isRequired,
};

export default DisplayArea;
