/* eslint-disable no-console */
import {
  collection, onSnapshot,
} from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { db } from '../../utils/firebaseInit';
import api from '../../utils/api';
import ScrollIndicator from '../../components/ScrollIndicator';
import HomeVisual from '../../components/HomeVisual';
import Filter from '../../components/Filter';
import FilterResults from '../../components/FilterResults';
import DisplayArea from '../../components/DisplayArea';
import PostEvent from '../../components/PostEvent';
import bg1 from '../../assets/big1.svg';
import bg3 from '../../assets/big2.svg';
import bg6 from '../../assets/background6.svg';
import filterBg from '../../assets/filter-bg2.svg';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div`
  height: 100vh;
  white-space: nowrap;
  display: flex;
  align-items: flex-start;
  scroll-snap-type: x mandatory;
`;

const Page = styled.div`
  width: auto;
  min-width: 1360px;
  height: 100vh;
  display: inline-block;
  background-color: ${(props) => (props.primary ? 'grey' : '#D9D9D9')};
  background-image: url(${(props) => (props.bg)});
  background-size: auto 100%;
  background-repeat: no-repeat;
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
`;

const SubPage = styled.div`
  min-width: 600px;
  height: 100vh;
  display: inline-block;
  background-image: url(${(props) => (props.bg)});
  background-size: auto 100%;
  background-repeat: no-repeat;
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
`;

function EventDisplay() {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [memberEvents, setMemberEvents] = useState([]);
  const [filteredShowInfo, setFilteredShowInfo] = useState([]);
  const [recentShowInfo, setRecentShowInfo] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('台北市');
  const [isGeolocation, setIsGeolocation] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [latitude, setLatitude] = useState(25.09108);
  const [longitude, setLongitude] = useState(121.5598);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showUid, setShowUid] = useState('');
  const distance = 10;
  const eventData = [];
  const pageText = {
    filtered: '根據您所選擇的時間與地點，精心為您篩選藝文活動。',
    recent: '不曉得該如何安排空閒時間嗎？可以參考看看這一週內，有哪些精彩的藝文活動。',
    popular: '',
  };

  const homeRef = useRef(null);
  const filteredInfoRef = useRef(null);
  const filteredEventsRef = useRef(null);
  const recentEventsRef = useRef(null);
  const popularEventsRef = useRef(null);
  const userEventsRef = useRef(null);
  const userEventsEditorRef = useRef(null);
  const scrollToElement = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  async function getIdQuery(UID) {
    const querySnapshot = await api.idQuery(UID);
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data());
    });
    // console.log({ eventData });
    setFilteredEvents(eventData);
  }

  async function getRecentIdQuery(UID) {
    const querySnapshot = await api.idQuery(UID);
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data());
    });
    // console.log({ eventData });
    setRecentEvents(eventData);
  }

  const getMaxMinLatLon = (lat, lng) => {
    const r = 6371.393; // 地球半徑公里 // distance是km
    let dlng = 2 * Math.asin(Math.sin(distance / (2 * r)) / Math.cos((lat * Math.PI) / 180));
    dlng = (dlng * 180) / Math.PI; // 角度轉為弧度
    let dlat = distance / r;
    dlat = (dlat * 180) / Math.PI;
    const minLat = lat - dlat;
    const maxLat = lat + dlat;
    const minLng = lng - dlng;
    const maxLng = lng + dlng;
    return {
      minLat, maxLat, minLng, maxLng,
    };
  };

  const success = (position) => {
    setIsGeolocation(true);
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    // latitude = 25.03867955570004;
    // longitude = 121.53237109734974;
    console.log(`Latitude is ${latitude}° Longitude is ${longitude}°`);
    api.getReverseGeocoding(position.coords.latitude, position.coords.longitude).then((json) => {
      setLocation(json.plus_code.compound_code.split(' ')[1].slice(2, 5));
    });
  };

  const error = () => {
    console.log('Unable to retrieve your location');
  };

  const locationHandeler = (value) => {
    setLocation(value);
    switch (value) {
      case '基隆市':
        setLatitude(25.13279);
        setLongitude(121.74457);
        break;
      case '新北市':
        setLatitude(25.01137);
        setLongitude(121.46173);
        break;
      case '宜蘭縣':
        setLatitude(24.75424);
        setLongitude(121.75285);
        break;
      case '新竹市':
        setLatitude(24.81524);
        setLongitude(120.96813);
        break;
      case '新竹縣':
        setLatitude(24.84209);
        setLongitude(121.01148);
        break;
      case '桃園市':
        setLatitude(25.02587);
        setLongitude(121.29689);
        break;
      case '苗栗縣':
        setLatitude(24.59214);
        setLongitude(120.82017);
        break;
      case '台中市':
        setLatitude(24.16116);
        setLongitude(120.73587);
        break;
      case '彰化縣':
        setLatitude(24.07949);
        setLongitude(120.54598);
        break;
      case '南投縣':
        setLatitude(23.92108);
        setLongitude(120.67898);
        break;
      case '嘉義市':
        setLatitude(23.48995);
        setLongitude(120.45141);
        break;
      case '嘉義縣':
        setLatitude(23.54765);
        setLongitude(120.43205);
        break;
      case '雲林縣':
        setLatitude(23.69586);
        setLongitude(120.52444);
        break;
      case '台南市':
        setLatitude(22.98854);
        setLongitude(120.19731);
        break;
      case '高雄市':
        setLatitude(22.62516);
        setLongitude(120.34277);
        break;
      case '屏東縣':
        setLatitude(22.66586);
        setLongitude(120.50559);
        break;
      case '台東縣':
        setLatitude(22.75670);
        setLongitude(121.15113);
        break;
      case '花蓮縣':
        setLatitude(23.99118);
        setLongitude(121.62969);
        break;
      default:
        setLatitude(25.03696);
        setLongitude(121.51898);
    }
  };

  const getRecentEvents = () => {
    setFilteredShowInfo([]);
    setStartDate(new Date());
    setEndDate(new Date());
    const {
      minLat, maxLat, minLng, maxLng,
    } = getMaxMinLatLon(latitude, longitude);
    const todayTimeStamp = new Date(new Date().toLocaleDateString('zh-TW'));
    const afterSevenDays = new Date(todayTimeStamp.setDate(todayTimeStamp.getDate() + 7));
    setEndDate(afterSevenDays);
    api.getNearbyEvents(latitude, longitude, distance).then((json) => {
      let infoUid = 0;
      json.forEach((data) => {
        data.showInfo.forEach((info) => {
          if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
            && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
            const infoStartTimeStamp = new Date(info.time.slice(0, 10));
            const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
            if ((todayTimeStamp >= infoStartTimeStamp
              && todayTimeStamp <= infoEndTimeStamp)
              || (afterSevenDays >= infoStartTimeStamp
                && afterSevenDays <= infoEndTimeStamp)) {
              // if ((infoStartTimeStamp >= todayTimeStamp
              //   && infoStartTimeStamp <= afterSevenDays)
              //   && (infoEndTimeStamp >= todayTimeStamp
              //     && infoEndTimeStamp <= afterSevenDays)) {
              recentShowInfo.push({
                info,
                title: data.title,
                UID: data.UID,
              });
              setRecentShowInfo(recentShowInfo);
              if (data.UID !== infoUid) {
                getRecentIdQuery(data.UID);
              }
              infoUid = data.UID;
            }
          }
        });
      });
    });
    // console.log('recentShowInfo', recentShowInfo);
  };

  const getFilteredEvents = () => {
    setSearchText('');
    setFilteredShowInfo([]);
    const {
      minLat, maxLat, minLng, maxLng,
    } = getMaxMinLatLon(latitude, longitude);
    const startDateTimeStamp = new Date(new Date(startDate).toLocaleDateString('zh-TW')).getTime();
    const endDateTimeStamp = new Date(new Date(endDate).toLocaleDateString('zh-TW')).getTime();
    api.getNearbyEvents(latitude, longitude, distance).then((json) => {
      let infoUid = 0;
      json.forEach((data) => {
        data.showInfo.forEach((info) => {
          if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
            && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
            const infoStartTimeStamp = new Date(info.time.slice(0, 10));
            const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
            // if ((startDateTimeStamp >= infoStartTimeStamp
            //   && startDateTimeStamp <= infoEndTimeStamp)
            //   || (endDateTimeStamp >= infoStartTimeStamp
            //     && endDateTimeStamp <= infoEndTimeStamp)) {
            if ((infoStartTimeStamp >= startDateTimeStamp
              && infoStartTimeStamp <= endDateTimeStamp)
              && (infoEndTimeStamp >= startDateTimeStamp
                && infoEndTimeStamp <= endDateTimeStamp)) {
              filteredShowInfo.push({
                info,
                title: data.title,
                UID: data.UID,
              });
              setFilteredShowInfo(filteredShowInfo);
              if (data.UID !== infoUid) {
                getIdQuery(data.UID);
              }
              infoUid = data.UID;
            }
          }
        });
      });
    });
    scrollToElement(filteredInfoRef);
    setIsFiltered(true);
  };

  const searchHandeler = (e) => {
    setSearchText(e.target.value);
  };

  async function getKeywordQuery() {
    const searchWords = searchText.split('');
    const querySnapshot = await api.keywordQuery(searchWords);
    const showInfo = [];
    const keywordEvents = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().title.includes(searchText)) {
        keywordEvents.push(doc.data());
        doc.data().showInfo.forEach((info) => {
          showInfo.push({
            info,
            title: doc.data().title,
            UID: doc.data().UID,
          });
        });
      }
    });
    setFilteredShowInfo(showInfo);
    setFilteredEvents(keywordEvents);
    scrollToElement(filteredInfoRef);
    setIsFiltered(true);
  }

  async function getHitRateEvents(num) {
    const hitRateEvents = [];
    const querySnapshot = await api.hitRateQuery(num);
    querySnapshot.forEach((doc) => {
      hitRateEvents.push(doc.data());
    });
    setPopularEvents(hitRateEvents);
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFiltered) {
      setFilteredShowInfo([]);
      getFilteredEvents();
    } else {
      setRecentShowInfo([]);
      getRecentEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  useEffect(() => {
    getHitRateEvents(600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const memberEventsRef = collection(db, 'memberEvents');
    const unsubscribe = onSnapshot(memberEventsRef, (querySnapshot) => {
      const memberEventsData = [];
      querySnapshot.forEach((doc) => {
        memberEventsData.push(doc.data());
      });
      setMemberEvents(memberEventsData);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollIndicator
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
      <Container>
        <Wrapper>
          <Page bg={bg6} ref={homeRef}>
            <HomeVisual />
            <Filter
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              isGeolocation={isGeolocation}
              location={location}
              locationHandeler={locationHandeler}
              getFilteredEvents={getFilteredEvents}
              searchHandeler={searchHandeler}
              getKeywordQuery={() => getKeywordQuery()}
              filteredInfoRef={filteredInfoRef}
              scrollToElement={scrollToElement}
            />
          </Page>
          <SubPage ref={filteredInfoRef} bg={filterBg} style={{ display: 'flex', justifyContent: 'center' }}>
            <FilterResults
              latitude={latitude}
              longitude={longitude}
              filteredShowInfo={filteredShowInfo}
              recentShowInfo={recentShowInfo}
              searchText={searchText}
              startDate={startDate}
              endDate={endDate}
              isFiltered={isFiltered}
              recentEvents={recentEvents}
              scrollToElement={scrollToElement}
              filteredEventsRef={filteredEventsRef}
              recentEventsRef={recentEventsRef}
              setShowUid={setShowUid}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              style={{ padding: '0', flexWrap: 'wrap' }}
            />
          </SubPage>
          {
            (isFiltered && filteredEvents?.length !== 0) && (
              <Page bg={bg1} ref={filteredEventsRef}>
                <DisplayArea title="Filtered" events={filteredEvents} text={pageText.filtered} showUid={showUid} setShowUid={setShowUid} location={location} primary={false} member={false} popular={false} />
              </Page>
            )
          }
          <Page bg={bg3} ref={recentEventsRef}>
            <DisplayArea title="Recent" events={recentEvents} text={pageText.recent} showUid={showUid} setShowUid={setShowUid} location={location} primary member={false} popular={false} />
          </Page>
          <Page ref={popularEventsRef}>
            <DisplayArea title="Popular" events={popularEvents} text={pageText.popular} showUid={showUid} setShowUid={setShowUid} location={location} primary={false} member={false} popular />
          </Page>
          <Page bg={bg1} ref={userEventsRef}>
            <DisplayArea title="Member" events={memberEvents} text={pageText.popular} showUid={showUid} setShowUid={setShowUid} location={location} primary={false} member popular={false} />
          </Page>
          <Page bg={bg3} ref={userEventsEditorRef}>
            <PostEvent />
          </Page>
        </Wrapper>
      </Container>
    </>
  );
}

export default EventDisplay;
