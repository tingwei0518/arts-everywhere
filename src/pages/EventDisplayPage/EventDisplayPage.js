/* eslint-disable no-console */
import {
  doc, setDoc, updateDoc, collection, onSnapshot,
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
import homeBg from '../../assets/background6.svg';
import filterBg from '../../assets/filter-bg2.svg';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Container = styled.div`
  width: fit-content;
  height: 100%;
  white-space: nowrap;
  display: flex;
  align-items: flex-start;
  transition: transform .5s linear;
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

  @media screen and (max-width: 450px) {
    width: 450px;
    min-width: 450px;
  }
`;

const SubPage = styled.div`
  min-width: 600px;
  height: 100vh;
  display: inline-block;
  background-image: url(${(props) => (props.bg)});
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;

  @media screen and (max-width: 450px) {
    width: 450px;
    min-width: 450px;
  }
`;

function EventDisplay() {
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const [scrolled, setScrolled] = useState(0);
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
    filtered: '根據您所選擇的時間與地點，精心為您篩選合適的藝文饗宴，探索各式表演藝術與歷史人文的跨領域展演。',
    recent: '參考這一週內、在您的周遭有哪些精彩的藝文活動，讓藝術成為日常，縮短與藝術的距離。',
    popular: '搜集目前最受歡迎、點擊率最高的展演活動，或許就有符合您喜好的藝文體驗。',
    member: '由 Arts Everywhere 的會員好朋友所刊登的藝文活動，分享多樣化的活動新訊。',
  };
  const containerRef = useRef(null);

  const resizeUpdate = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 450) {
      setIsMobileScreen(true);
    }
  };
  useEffect(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 450) {
      setIsMobileScreen(true);
    }
    window.addEventListener('resize', resizeUpdate);
    return () => {
      window.removeEventListener('resize', resizeUpdate);
    };
  }, []);

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

  async function getIdQuery(UID) {
    const {
      minLat, maxLat, minLng, maxLng,
    } = getMaxMinLatLon(latitude, longitude);
    const startDateTimeStamp = new Date(new Date(startDate).toLocaleDateString('zh-TW')).getTime();
    const endDateTimeStamp = new Date(new Date(endDate).toLocaleDateString('zh-TW')).getTime();
    const querySnapshot = await api.idQuery(UID);
    querySnapshot.forEach((snapshotDoc) => {
      eventData.push(snapshotDoc.data());
      snapshotDoc.data().showInfo.forEach((info) => {
        if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
          && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
          const infoStartTimeStamp = new Date(info.time.slice(0, 10));
          const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
          if ((startDateTimeStamp >= infoStartTimeStamp
            && startDateTimeStamp <= infoEndTimeStamp)
            || (endDateTimeStamp >= infoStartTimeStamp
              && endDateTimeStamp <= infoEndTimeStamp)) {
            filteredShowInfo.push({
              info,
              title: snapshotDoc.data().title,
              UID: snapshotDoc.data().UID,
            });
            setFilteredShowInfo(filteredShowInfo);
          }
        }
      });
    });
    setFilteredEvents(eventData);
    console.log(eventData);
  }

  async function getRecentIdQuery(UID) {
    const {
      minLat, maxLat, minLng, maxLng,
    } = getMaxMinLatLon(latitude, longitude);
    const todayTimeStamp = new Date(new Date().toLocaleDateString('zh-TW'));
    const afterSevenDays = new Date(todayTimeStamp.setDate(todayTimeStamp.getDate() + 7));
    const querySnapshot = await api.idQuery(UID);
    querySnapshot.forEach((snapshotDoc) => {
      eventData.push(snapshotDoc.data());
      snapshotDoc.data().showInfo.forEach((info) => {
        if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
          && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
          const infoStartTimeStamp = new Date(info.time.slice(0, 10));
          const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
          if ((todayTimeStamp >= infoStartTimeStamp
            && todayTimeStamp <= infoEndTimeStamp)
            || (afterSevenDays >= infoStartTimeStamp
              && afterSevenDays <= infoEndTimeStamp)) {
            recentShowInfo.push({
              info,
              title: snapshotDoc.data().title,
              UID: snapshotDoc.data().UID,
            });
            setRecentShowInfo(recentShowInfo);
          }
        }
      });
    });
    setRecentEvents(eventData);
  }

  const success = (position) => {
    setIsGeolocation(true);
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    // latitude = 25.03867955570004;
    // longitude = 121.53237109734974;
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
              if (data.UID !== infoUid) {
                getRecentIdQuery(data.UID);
              }
              infoUid = data.UID;
            }
          }
        });
      });
    });
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
              if (data.UID !== infoUid) {
                getIdQuery(data.UID);
              }
              infoUid = data.UID;
            }
          }
        });
      });
    });
    setScrolled(600);
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
    querySnapshot.forEach((snapshotDoc) => {
      if (snapshotDoc.data().title.includes(searchText)) {
        keywordEvents.push(snapshotDoc.data());
        snapshotDoc.data().showInfo.forEach((info) => {
          showInfo.push({
            info,
            title: snapshotDoc.data().title,
            UID: snapshotDoc.data().UID,
          });
        });
      }
    });
    setFilteredShowInfo(showInfo);
    setFilteredEvents(keywordEvents);
    setScrolled(600);
    setIsFiltered(true);
  }

  async function getHitRateEvents(num) {
    const hitRateEvents = [];
    const querySnapshot = await api.hitRateQuery(num);
    querySnapshot.forEach((snapshotDoc) => {
      hitRateEvents.push(snapshotDoc.data());
    });
    setPopularEvents(hitRateEvents);
  }

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(success, error);
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
      querySnapshot.forEach((snapshotDoc) => {
        memberEventsData.push(snapshotDoc.data());
      });
      setMemberEvents(memberEventsData);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = (event) => {
      if (event.target.tagName === 'FORM' || event.target.tagName === 'LABEL'
        || event.target.tagName === 'INPUT' || event.target.tagName === 'UL'
        || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'LI') return;
      if (event.target.className.includes('EventModal')) return;
      if (event.target.className.includes('gm')) return;
      setScrolled((preValue) => {
        const value = preValue + event.deltaY;
        if (value < 0) return 0;
        if (value > containerRef.current.offsetWidth - window.innerWidth) {
          return containerRef.current.offsetWidth - window.innerWidth;
        }
        return value;
      });
    };
    window.addEventListener('wheel', onScroll);
    return () => window.removeEventListener('wheel', onScroll);
  }, [currentUserId, scrolled]);

  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
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
          position: scrolled,
          isActive: true,
          userId: data.id,
        });
      }
    }, '3000');
    return () => { clearTimeout(timeoutRef.current); };
  }, [currentUserId, scrolled]);

  useEffect(() => {
    function setActiveFalse() {
      if (!currentUserId) return;
      const userPositionRef = doc(db, 'userPosition', currentUserId);
      updateDoc(userPositionRef, {
        isActive: false,
      });
    }
    return setActiveFalse;
  }, [currentUserId]);

  useEffect(() => {
    const handleBeforeunload = () => {
      if (!currentUserId) return;
      const userPositionRef = doc(db, 'userPosition', currentUserId);
      updateDoc(userPositionRef, {
        isActive: false,
      });
    };
    window.addEventListener('beforeunload', handleBeforeunload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, [currentUserId]);

  return (
    <>
      <ScrollIndicator
        isFiltered={isFiltered}
        scrolled={scrolled}
        setScrolled={setScrolled}
        containerRef={containerRef}
        currentUserId={currentUserId}
        isMobileScreen={isMobileScreen}
      />
      <Wrapper>
        <Container ref={containerRef} style={{ width: '', transform: `translate3d(-${scrolled}px, 0px, 0px)` }}>
          <Page bg={homeBg}>
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
            />
          </Page>
          <SubPage bg={filterBg} style={{ display: 'flex', justifyContent: 'center' }}>
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
              setScrolled={setScrolled}
              setShowUid={setShowUid}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              style={{ padding: '0', flexWrap: 'wrap' }}
            />
          </SubPage>
          {
            (isFiltered) && (
              <Page bg={bg1}>
                <DisplayArea title="Filtered" events={filteredEvents} color="white" scrolled={scrolled} text={pageText.filtered} showUid={showUid} setShowUid={setShowUid} location={location} primary={false} member={false} popular={false} />
              </Page>
            )
          }
          <Page bg={bg3}>
            <DisplayArea title="Recent" events={recentEvents} color="darkgrey" scrolled={scrolled} text={pageText.recent} showUid={showUid} setShowUid={setShowUid} location={location} primary member={false} popular={false} />
          </Page>
          <Page>
            <DisplayArea title="Popular" events={popularEvents} color="#5F5F5F" scrolled={scrolled} text={pageText.popular} showUid={showUid} setShowUid={setShowUid} location={location} primary={false} member={false} popular />
          </Page>
          <Page bg={bg1}>
            <DisplayArea title="Member" events={memberEvents} color="white" scrolled={scrolled} text={pageText.member} showUid={showUid} setShowUid={setShowUid} location={location} primary={false} member popular={false} />
          </Page>
          <Page bg={bg3}>
            <PostEvent />
          </Page>
        </Container>
      </Wrapper>
    </>
  );
}

export default EventDisplay;
