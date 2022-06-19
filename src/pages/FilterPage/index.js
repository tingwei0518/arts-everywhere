import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import db from '../../utils/firebaseInit';

function FilterPage() {
  const [location, setLocation] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [latitude, setLatitude] = useState(25.09108);
  const [longitude, setLongitude] = useState(121.5598);
  const distance = 5;

  const getIsRainy = () => {
    fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-0DC422DA-5DF2-46DD-819A-A5348111FC62&format=JSON&locationName=%E8%87%BA%E5%8C%97%E5%B8%82&elementName=PoP')
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  async function getIdQuery(UID) {
    const artsEventsRef = collection(db, 'artsEvents');
    const q = query(artsEventsRef, where('UID', '==', `${UID}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  }

  const getMaxMinLatLon = (lat, lng) => {
    const r = 6371.393; // 地球半徑公里
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
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    // latitude = 25.03867955570004;
    // longitude = 121.53237109734974;
    console.log(`Latitude is ${latitude}° Longitude is ${longitude}°`);
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GEOCODING_API_KEY}`)
      .then((response) => response.json())
      .then((json) => {
        setLocation(json.plus_code.compound_code.slice(11, 14));
      });

    // const img = new Image();
    // img.src = `http://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=300x300&sensor=false`;

    // output.appendChild(img);
  };

  const error = () => {
    console.log('Unable to retrieve your location');
  };

  // const getUserGeolocation = () => {
  //   if (!navigator.geolocation) {
  //     console.log('Geolocation is not supported by your browser');
  //   } else {
  //     console.log('Locating…');
  //     navigator.geolocation.getCurrentPosition(success, error);
  //   }
  // };
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateHandeler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const locationHandeler = (e) => {
    setLocation(e.target.value);
    switch (e.target.value) {
      case '基隆市':
        setLatitude(25.10898);
        setLongitude(121.7081);
        break;
      case '新北市':
        setLatitude(24.91571);
        setLongitude(121.6739);
        break;
      case '宜蘭縣':
        setLatitude(24.69295);
        setLongitude(121.7195);
        break;
      case '新竹市':
        setLatitude(24.80395);
        setLongitude(120.9647);
        break;
      case '新竹縣':
        setLatitude(24.70328);
        setLongitude(121.1252);
        break;
      case '桃園市':
        setLatitude(24.93759);
        setLongitude(121.2168);
        break;
      case '苗栗縣':
        setLatitude(24.48927);
        setLongitude(120.9417);
        break;
      case '台中市':
        setLatitude(24.23321);
        setLongitude(120.9417);
        break;
      case '彰化縣':
        setLatitude(23.99297);
        setLongitude(120.4818);
        break;
      case '南投縣':
        setLatitude(23.83876);
        setLongitude(120.9876);
        break;
      case '嘉義市':
        setLatitude(23.47545);
        setLongitude(120.4473);
        break;
      case '嘉義縣':
        setLatitude(23.45889);
        setLongitude(120.574);
        break;
      case '雲林縣':
        setLatitude(23.75585);
        setLongitude(120.3897);
        break;
      case '台南市':
        setLatitude(23.1417);
        setLongitude(120.2513);
        break;
      case '高雄市':
        setLatitude(23.01087);
        setLongitude(120.666);
        break;
      case '屏東縣':
        setLatitude(22.54951);
        setLongitude(120.62);
        break;
      case '台東縣':
        setLatitude(22.98461);
        setLongitude(120.9876);
        break;
      case '花蓮縣':
        setLatitude(23.7569);
        setLongitude(121.3542);
        break;
      default:
        setLatitude(25.09108);
        setLongitude(121.5598);
    }
  };

  const getFilteredEvents = () => {
    fetch(`https://cloud.culture.tw/frontsite/opendata/activityOpenDataJsonAction.do?method=doFindActivitiesNearBy&lat=${latitude}&lon=${longitude}&range=${distance}`)
      .then((response) => response.json())
      .then((json) => {
        const {
          minLat, maxLat, minLng, maxLng,
        } = getMaxMinLatLon(latitude, longitude);
        json.forEach((data) => {
          data.showInfo.forEach((info) => {
            if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
              && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
              const startDateTimeStamp = new Date(new Date(startDate).toLocaleDateString('en-US')).getTime();
              const endDateTimeStamp = new Date(new Date(endDate).toLocaleDateString('en-US')).getTime();
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
                getIdQuery(data.UID);
              }
            }
          });
        });
      });
  };

  const getRecentEvents = () => {
    setStartDate(new Date());
    setEndDate(null);
    fetch(`https://cloud.culture.tw/frontsite/opendata/activityOpenDataJsonAction.do?method=doFindActivitiesNearBy&lat=${latitude}&lon=${longitude}&range=${distance}`)
      .then((response) => response.json())
      .then((json) => {
        const {
          minLat, maxLat, minLng, maxLng,
        } = getMaxMinLatLon(latitude, longitude);
        json.forEach((data) => {
          data.showInfo.forEach((info) => {
            if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
              && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
              const todayTimeStamp = new Date(new Date().toLocaleDateString('en-US'));
              const afterSevenDays = new Date(todayTimeStamp.setDate(todayTimeStamp.getDate() + 7));
              const infoStartTimeStamp = new Date(info.time.slice(0, 10));
              const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
              // if ((todayTimeStamp >= infoStartTimeStamp
              //   && todayTimeStamp <= infoEndTimeStamp)
              //   || (afterSevenDays >= infoStartTimeStamp
              //     && afterSevenDays <= infoEndTimeStamp)) {
              if ((infoStartTimeStamp >= todayTimeStamp
                && infoStartTimeStamp <= afterSevenDays)
                && (infoEndTimeStamp >= todayTimeStamp
                  && infoEndTimeStamp <= afterSevenDays)) {
                getIdQuery(data.UID);
              }
            }
          });
        });
      });
  };

  return (
    <>
      <select value={location} onChange={(e) => locationHandeler(e)}>
        <option value="台北市">台北市</option>
        <option value="基隆市">基隆市</option>
        <option value="新北市">新北市</option>
        <option value="宜蘭縣">宜蘭縣</option>
        <option value="新竹市">新竹市</option>
        <option value="新竹縣">新竹縣</option>
        <option value="桃園市">桃園市</option>
        <option value="苗栗縣">苗栗縣</option>
        <option value="台中市">台中市</option>
        <option value="彰化縣">彰化縣</option>
        <option value="南投縣">南投縣</option>
        <option value="嘉義市">嘉義市</option>
        <option value="嘉義縣">嘉義縣</option>
        <option value="雲林縣">雲林縣</option>
        <option value="台南市">台南市</option>
        <option value="高雄市">高雄市</option>
        <option value="屏東縣">屏東縣</option>
        <option value="台東縣">台東縣</option>
        <option value="花蓮縣">花蓮縣</option>
      </select>
      <br />
      <br />
      <br />
      <button type="button" onClick={getRecentEvents}>拿一周內附近的展演資料</button>
      <br />
      <br />
      <br />
      <DatePicker
        selected={startDate}
        onChange={dateHandeler}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
      <button type="button" onClick={getFilteredEvents}>拿自行設定地點、時間後的展演資料</button>
      <button type="button" onClick={getIsRainy}>天氣</button>
    </>
  );
}

export default FilterPage;
