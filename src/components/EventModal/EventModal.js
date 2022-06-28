import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
// import api from '../../utils/api';
import close from '../../images/close.png';
import share from '../../images/share.png';
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
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.5);
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 80%;
  height: 80%;
  background-color: white;
  position: relative;
  text-align: center;
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: white;
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
`;

const MainInfo = styled.div`
  width: 32%;
  display: flex;
  flex-direction: column;
`;

const Tag = styled.div`
  width: fit-content;
  font-size: .8rem;
  text-align: left;
  padding: 3px 3px; 
  border: .8px solid black;
`;

const Title = styled.div`
  font-size: 2rem;
  text-align: left;
  font-weight: bold;
  margin-top: 10px;
`;

const Date = styled.div`
  font-size: 1rem;
  text-align: left;
  font-weight: bold;
  margin: 10px 0;
  padding-right: 10px;
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  border-top: 2px solid black;
  padding: 20px 0;
  font-size: .9rem;
  text-align: left;
  padding-right: 10px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Information = styled.div`
  border-top: 2px solid black;
  padding-top: 20px;
  font-size: .9rem;
  text-align: left;
`;

const ModalImage = styled.div`
  box-sizing: content-box;
  min-width: 30%;
  min-height: 90%;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
`;

const SessionTable = styled.div`
  width: 28%;
`;

const TableTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 2px solid black;
`;

const SessionLists = styled.div`
  height: 90%;
  padding-right: 10px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Session = styled.div`
  border-bottom: 1px solid black;
  margin-top: 10px;
  padding-bottom: 10px;
  text-align: left;
  font-size: .9rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  width: 95px;
  height: fit-content;
  background: black;
  color: white;
  text-align: center;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
`;

function EventModal({ event, setShowUid, location }) {
  const [weatherLocation, setWeatherLocation] = useState(location);
  // let weatherDesc = [];
  const weatherDesc = [];

  const getLocationWeather = () => {
    switch (weatherLocation) {
      case '台北市':
        // api.getWeatherDesc('臺北市').then((json) => {
        //   weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
        console.log('臺北市', weatherDesc);
        // });
        break;
      case '台中市':
        // api.getWeatherDesc('臺中市').then((json) => {
        //   weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
        console.log('臺中市', weatherDesc);
        // });
        break;
      case '台南市':
        // api.getWeatherDesc('臺南市').then((json) => {
        //   weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
        console.log('臺南市', weatherDesc);
        // });
        break;
      case '台東縣':
        // api.getWeatherDesc('臺東縣').then((json) => {
        //   weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
        console.log('臺東縣', weatherDesc);
        // });
        break;
      default:
        // api.getWeatherDesc(weatherLocation).then((json) => {
        //   weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
        console.log(weatherLocation, weatherDesc);
      // });
    }
  };

  const getAddressWeather = (address) => {
    const city = address.slice(0, 3);
    setWeatherLocation(city);
  };

  useEffect(() => {
    getLocationWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherLocation]);
  console.log({ event });
  return (
    <Wrapper>
      <Modal>
        <ModalHeader>
          <CloseBtn onClick={() => setShowUid('')} />
        </ModalHeader>
        <InfoSection>
          <MainInfo>
            <Tag>{eventCategory[Number(event.category)]}</Tag>
            <Title>{event.title}</Title>
            <Date>
              {event.startDate}
              {' '}
              {
                event.startDate !== event.endDate
                && (` - ${event.endDate}`)
              }
              <img
                src={share}
                alt="share infomation"
                style={{
                  width: '20px', marginLeft: 'auto', opacity: '.5', cursor: 'pointer',
                }}
              />
            </Date>
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
                        <span style={{ marginRight: '10px' }}>活動單位</span>
                        <span>{event.masterUnit}</span>
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
          <ModalImage
            src={event.imageUrl ? event.imageUrl : eventImageProps[Number(event.category)]}
          />
          <SessionTable>
            <TableTitle>活動場次</TableTitle>
            <SessionLists>
              {
                event.showInfo.map((info) => (
                  <Session onClick={() => getAddressWeather(info.location)}>
                    <div>
                      <div>
                        {info.time}
                        {' '}
                        -
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        {' '}
                        {info.endTime}
                      </div>
                      <Tag>{info.location.slice(0, 3)}</Tag>
                      <div style={{ marginTop: '10px' }}>{info.locationName}</div>
                    </div>
                    <Button>
                      加入行事曆
                    </Button>
                  </Session>
                ))
              }
            </SessionLists>
          </SessionTable>
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
  location: PropTypes.string.isRequired,
};

export default EventModal;
