import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import close from '../../images/close.png';
import share from '../../images/share.png';
import line from '../../images/line.png';
import fb from '../../images/fb.png';
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
import sunny from '../../images/sunny.png';
import cloudy from '../../images/cloudy.png';
import rainy from '../../images/rainy.png';
import empty from '../../images/empty.png';
import otherWeather from '../../images/cloudy-and-sunny.png';

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

const weatherImageProps = [sunny, cloudy, rainy, otherWeather, empty];

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.5);
  display: flex;
  position: fixed;
  top: 0;
  justify-content: center;
  align-items: center;
  z-index: 7;
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition-duration: .3s;
  transition-timing-function: ease-out;
  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};

`;

const Modal = styled.div`
  width: 80%;
  height: 80%;
  background-color: white;
  position: relative;
  text-align: center;

  @media screen and (max-width: 1000px) {
    width: 100%;
    height: calc(100% - 120px);
    align-self: start;
    overflow-y: auto;
  }
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: white;

  @media screen and (max-width: 1000px) {
    height: 30px;
  }
`;

const CloseBtn = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0px;
  right: 20px;
  margin: 20px 0;
  background-image: url(${close});
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
`;

const InfoSection = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  padding: 0 50px 30px 45px;
  white-space: normal;
  flex-direction: row;
  justify-content: space-between;

  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;

const MainInfo = styled.div`
  width: 32%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`;

const Tag = styled.div`
  width: fit-content;
  font-size: .9rem;
  text-align: left;
  padding: 3px 3px; 
  border: .8px solid black;
`;

const Title = styled.div`
  font-size: 2rem;
  text-align: left;
  font-weight: bold;
  margin-top: 10px;

  @media screen and (max-width: 1000px) {
    font-size: 1.3rem;
  }
`;

const Day = styled.div`
  font-size: 1.2rem;
  text-align: left;
  font-weight: bold;
  margin: 10px 0;
  padding-right: 10px;
  display: flex;
  align-items: center;

  @media screen and (max-width: 1000px) {
    font-size: 1rem;
  }
`;

const Description = styled.div`
  border-top: 2px solid black;
  padding: 20px 0;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: left;
  padding-right: 10px;
  overflow-y: auto;
  overflow-x: hidden;

  @media screen and (max-width: 1000px) {
    max-height: 100px;
  }
`;

const Information = styled.div`
  border-top: 2px solid black;
  padding-top: 20px;
  font-size: 1rem;
  text-align: left;

  @media screen and (max-width: 1000px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 30px;
  }
`;

const ModalImage = styled.img`
  width: 30%;
  height: fit-content;

  @media screen and (max-width: 1000px) {
    margin-top: 20px;
    width: 100%;
  }
`;

const ModalBackgroundImage = styled.div`
  box-sizing: content-box;
  width: 30%;
  height: 95%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media screen and (max-width: 1000px) {
    margin-top: 20px;
    width: 100%;
    height: 100%;
    background-size: cover;
  }
`;

const SubInfo = styled.div`
  width: 28%;
  height: 98%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1000px) {
    width: 100%;
    height: 120px;
    margin-top: 20px;
  }
`;

const SessionTable = styled.div`
  width: 100%;
  height: ${(props) => (props.week ? '35%' : '90%')};
  
  @media screen and (max-width: 1000px) {
    width: 100%;
    height: 100%;
    margin-top: 20px;
  }
  `;

const TableTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 2px solid black;
`;

const SessionLists = styled.div`
  padding-right: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const Session = styled.div`
  border-bottom: 1px solid black;
  margin-top: 10px;
  padding-bottom: 10px;
  text-align: left;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
`;

const WeatherIconWrapper = styled.div`
  position: relative;
  div {
    position: absolute;
    top: 0;
    right: 38px;
    min-width: 50px;
    text-align: center;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 5px;
    padding: 2px 5px;
    color: white;
    font-size: .9rem;
    opacity: 0;
  }
  &:hover {
    div {
      opacity: 1;
    }
  }
`;

const WeatherIcon = styled.img`
  width: 30px;
  height: 30px;
  position: ${(props) => (props.week ? 'static' : 'absolute')};
  top: 0;
  right: 0;
`;

const Button = styled.button`
  width: 90px;
  height: fit-content;
  background: black;
  font-size: .7rem;
  color: white;
  text-align: center;
  padding: 3px 7px;
  margin-left: 5px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
`;

const WeatherTable = styled.div`
  margin-top: 50px;
`;

const WeatherLists = styled.div`
  display: flex;
  flex-direction: row;
  font-size: .9rem;
  padding: 10px 0;
  justify-content: space-between;

  @media screen and (max-width: 1400px) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const Weather = styled.div`
  position: relative;
  span {
    position: absolute;
    top: 60px;
    left: -10px;
    min-width: 50px;
    text-align: center;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 5px;
    padding: 2px 5px;
    color: white;
    font-size: .9rem;
    opacity: 0;
  }
  &:hover {
    span {
      opacity: 1;
    }
  }

  @media screen and (max-width: 1400px) {
    margin-right: 15px;
    span {
      background-color: rgba(0, 0, 0, 1);
      z-index: 3;
    }
  }
`;

function EventModal({
  event, setShowUid, member, idx, show, scrolled,
}) {
  const [weatherData, setWeatherData] = useState([]);
  const [weeklyWeatherData, setWeeklyWeatherData] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const url = window.location.href;
  const { gapi } = window;

  function getWeatherIcon(desc) {
    if (desc === undefined) {
      return weatherImageProps[4];
    }
    if (desc.includes('雨')) {
      return weatherImageProps[2];
    }
    if (desc.includes('晴') && desc.includes('雲')) {
      return weatherImageProps[3];
    }
    if (desc.includes('陰') || desc.includes('多雲')) {
      return weatherImageProps[1];
    }
    return weatherImageProps[0];
  }

  const getWeeklyLocationWeather = (weatherLocation) => {
    switch (weatherLocation) {
      case '台北市':
        return api.getWeatherDesc('臺北市')
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      case '台中市':
        return api.getWeatherDesc('臺中市')
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      case '台南市':
        return api.getWeatherDesc('臺南市')
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      case '台東縣':
        return api.getWeatherDesc('臺東縣')
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      default:
        return api.getWeatherDesc(weatherLocation)
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
    }
  };

  const getOneDayLocationWeather = (weatherLocation, timeFrom, timeTo) => {
    switch (weatherLocation) {
      case '台北市':
        return api.getOneDayWeatherDesc('臺北市', timeFrom, timeTo)
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      case '台中市':
        return api.getOneDayWeatherDesc('臺中市', timeFrom, timeTo)
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      case '台南市':
        return api.getOneDayWeatherDesc('臺南市', timeFrom, timeTo)
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      case '台東縣':
        return api.getOneDayWeatherDesc('臺東縣', timeFrom, timeTo)
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
      default:
        return api.getOneDayWeatherDesc(weatherLocation, timeFrom, timeTo)
          .then((json) => json.records.locations[0].location[0].weatherElement[0].time);
    }
  };

  useEffect(() => {
    const isShowCrossDays = event.showInfo.some((info) => info.time.split(' ')[0] !== info.endTime.split(' ')[0]);
    if (isShowCrossDays) return;
    const todayTimeStamp = dayjs();
    const afterSevenDays = dayjs().add(7, 'day');

    function getWeather(info) {
      const eventTimeStamp = dayjs(info.time);
      if ((eventTimeStamp <= afterSevenDays) && (eventTimeStamp >= todayTimeStamp)) {
        const timeFrom = dayjs(info.time.split(' ')[0]).format('YYYY-MM-DDTHH:mm:ss');
        const timeTo = dayjs(info.time.split(' ')[0]).add(1, 'day').format('YYYY-MM-DDTHH:mm:ss');
        return getOneDayLocationWeather(info.location.slice(0, 3), timeFrom, timeTo);
      }
      return null;
    }
    Promise.all(event.showInfo.map(getWeather)).then((weather) => {
      setWeatherData(weather);
    });
  }, [event.showInfo]);

  useEffect(() => {
    const isShowCrossDays = event.showInfo.some((info) => info.time.split(' ')[0] !== info.endTime.split(' ')[0]);
    if (!isShowCrossDays) return;
    const afterSevenDays = dayjs().add(7, 'day');
    const isShowDateOverlap = event.showInfo.some((info) => afterSevenDays >= dayjs(info.time)
      || (afterSevenDays >= dayjs(info.endTime)));
    if (isShowDateOverlap) {
      getWeeklyLocationWeather(event.showInfo[0].location.slice(0, 3))
        .then((data) => {
          setWeeklyWeatherData(data);
        });
    }
  }, [event.showInfo]);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: 'v12.0',
      });
      window.FB.XFBML.parse();
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      const js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/zh_TW/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  const CLIENT_ID = '548994073184-t4o8hf7jmk1boqor2jcttvbd0l67a0qd.apps.googleusercontent.com';
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  const handleAuthClick = () => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));
      gapi.auth2.getAuthInstance().signIn()
        .then(() => {
          const insertedEvent = {
            summary: 'Google I/O 2015',
            location: '800 Howard St., San Francisco, CA 94103',
            description: 'A chance to hear more about Google\'s developer products.',
            start: {
              dateTime: '2022-07-10T09:00:00-07:00',
              timeZone: 'America/Los_Angeles',
            },
            end: {
              dateTime: '2022-07-10T17:00:00-07:00',
              timeZone: 'America/Los_Angeles',
            },
          };
          const request = gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: insertedEvent,
          });
          request.execute();
        });
    });
  };

  return (
    <Wrapper show={show} style={{ left: `${scrolled}px` }}>
      <Modal>
        <ModalHeader>
          <Link to="/">
            <CloseBtn onClick={() => setShowUid('')} />
          </Link>
        </ModalHeader>
        <InfoSection>
          <MainInfo>
            <Tag>{eventCategory[Number(event.category)]}</Tag>
            <Title>{event.title}</Title>
            <Day>
              {event.startDate}
              {' '}
              {
                event.startDate !== event.endDate
                && (` - ${event.endDate}`)
              }
              <button
                type="button"
                onClick={() => setIsSharing(!isSharing)}
                style={{
                  all: 'unset', cursor: 'pointer', position: 'relative', marginLeft: 'auto',
                }}
              >
                {
                  isSharing
                    ? (
                      <>
                        <img
                          src={share}
                          alt="share infomation"
                          style={{
                            width: '20px', opacity: '1',
                          }}
                        />
                        <a href={`https://social-plugins.line.me/lineit/share?url=${url}`} target="_blank" rel="noreferrer">
                          <img
                            src={line}
                            alt="line share"
                            style={{
                              width: '25px', position: 'absolute', top: '25px', right: '-5px',
                            }}
                          />
                        </a>
                        <Helmet>
                          <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v12.0" nonce="dmrjeGLN" />
                        </Helmet>
                        <div className="fb-share-button" data-href={url} data-layout="button_count" data-size="large">
                          <a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Farts-everywhere-108b3.web.app%2F%3Fid%3D${event.UID}&amp;src=sdkpreparse`} className="fb-xfbml-parse-ignore" rel="noreferrer">
                            <img
                              src={fb}
                              alt="facebook share"
                              style={{
                                width: '25px', position: 'absolute', top: '50px', right: '-5px',
                              }}
                            />
                          </a>
                        </div>
                      </>
                    ) : (
                      <img
                        src={share}
                        alt="share infomation"
                        style={{
                          width: '20px', opacity: '.5',
                        }}
                      />
                    )
                }
              </button>
            </Day>
            {
              event.descriptionFilterHtml
              && (
                <Description>
                  {event.descriptionFilterHtml}
                </Description>
              )
            }
            {
              (event.masterUnit || event.sourceWebPromote)
              && (
                <Information>
                  {
                    (event.masterUnit.length !== 0)
                    && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ marginRight: '10px' }}>主辦單位</span>
                        <span>{event.masterUnit}</span>
                      </div>
                    )
                  }
                  {
                    (event.showUnit)
                    && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ marginRight: '10px' }}>活動單位</span>
                        <span>{event.showUnit}</span>
                      </div>
                    )
                  }
                  {
                    (event.sourceWebPromote)
                    && (
                      <div>
                        <span style={{ marginRight: '10px' }}>相關連結</span>
                        <a href={event.sourceWebPromote} target="_blank" rel="noreferrer">活動網址</a>
                      </div>
                    )
                  }
                </Information>
              )
            }
          </MainInfo>
          {
            member
              ? (
                <ModalImage
                  src={event.imageUrl
                    ? event.imageUrl : eventImageProps[Number(event.category)][idx % 3]}
                  alt={event.title}
                />
              ) : (
                <ModalBackgroundImage
                  src={event.imageUrl
                    ? event.imageUrl : eventImageProps[Number(event.category)][idx % 3]}
                />
              )
          }
          <SubInfo>
            <SessionTable week={weeklyWeatherData?.length !== 0}>
              <TableTitle>活動場次</TableTitle>
              <SessionLists>
                {
                  event.showInfo.map((info, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Session key={index}>
                      <div>
                        <div>
                          {info.time.slice(0, 16)}
                          {' '}
                          -
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          {' '}
                          {info.endTime.slice(0, 16)}
                        </div>
                        <Tag>
                          {info?.location.slice(0, 3)}
                        </Tag>
                        <div style={{ marginTop: '10px' }}>{info.locationName}</div>
                      </div>
                      <div style={{
                        position: 'relative', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between',
                      }}
                      >
                        {
                          (weatherData.length !== 0 && weatherData[index] !== null)
                            ? (
                              <WeatherIconWrapper>
                                <div>{weatherData?.[index]?.[0]?.elementValue?.[0]?.value?.split('。')?.[0]}</div>
                                <WeatherIcon
                                  src={getWeatherIcon(weatherData?.[index]?.[0]?.elementValue?.[0]?.value?.split('。')?.[0])}
                                  alt={weatherData?.[index]?.[0]?.elementValue?.[0]?.value?.split('。')?.[0]}
                                />
                              </WeatherIconWrapper>
                            ) : <div style={{ width: '30px', height: '30px' }} />
                        }
                        <Button onClick={handleAuthClick} style={{ width: '90px', fontSize: '.9rem' }}>
                          加入行事曆
                        </Button>
                      </div>
                    </Session>
                  ))
                }
              </SessionLists>
            </SessionTable>
            {
              (weeklyWeatherData.length !== 0)
              && (
                <WeatherTable>
                  <TableTitle>一週天氣</TableTitle>
                  <WeatherLists>
                    {
                      weeklyWeatherData
                        .filter((_, index) => index % 2 === 0)
                        .map((data) => (
                          <Weather>
                            <div style={{ marginBottom: '10px' }}>{dayjs(data?.startTime?.split(' ')?.[0]).format('M/D')}</div>
                            <WeatherIcon
                              src={getWeatherIcon(data?.elementValue?.[0]?.value?.split('。')?.[0])}
                              alt={data?.elementValue?.[0]?.value?.split('。')?.[0]}
                              week
                            />
                            <span>{data?.elementValue?.[0]?.value?.split('。')?.[0]}</span>
                          </Weather>
                        ))
                    }
                  </WeatherLists>
                </WeatherTable>
              )
            }
          </SubInfo>
        </InfoSection>
      </Modal>
    </Wrapper>
  );
}

EventModal.propTypes = {
  setShowUid: PropTypes.func.isRequired,
  event: PropTypes.shape({
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
  }).isRequired,
  member: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  scrolled: PropTypes.number.isRequired,
};

export default EventModal;
