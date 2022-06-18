import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import db from '../../utils/firebaseInit';

function Entry() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const distance = 5;

  async function getIdQuery(UID) {
    const artsEventsRef = collection(db, 'artsEvents');
    const q = query(artsEventsRef, where('UID', '==', `${UID}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  }

  const getMaxMinLatLon = (latitude, longitude) => {
    const r = 6371.393; // 地球半徑公里
    let dlng = 2 * Math.asin(Math.sin(distance / (2 * r)) / Math.cos((latitude * Math.PI) / 180));
    dlng = (dlng * 180) / Math.PI; // 角度轉為弧度
    let dlat = distance / r;
    dlat = (dlat * 180) / Math.PI;
    const minLat = latitude - dlat;
    const maxLat = latitude + dlat;
    const minLng = longitude - dlng;
    const maxLng = longitude + dlng;
    return {
      minLat, maxLat, minLng, maxLng,
    };
  };

  const success = (position) => {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // const latitude = 25.03867955570004;
    // const longitude = 121.53237109734974;
    console.log(`Latitude is ${latitude}° Longitude is ${longitude}°`);
    fetch(`https://cloud.culture.tw/frontsite/opendata/activityOpenDataJsonAction.do?method=doFindActivitiesNearBy&lat=${latitude}&lon=${longitude}&range=${distance}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        const {
          minLat, maxLat, minLng, maxLng,
        } = getMaxMinLatLon(latitude, longitude);
        json.forEach((data) => {
          data.showInfo.forEach((info) => {
            if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
              && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
              const startDateString = new Date(new Date(startDate).toLocaleDateString('en-US')).getTime();
              const endDateString = new Date(new Date(endDate).toLocaleDateString('en-US')).getTime();
              const timeSlice = new Date(info.time.slice(0, 10));
              const endTimeSlice = new Date(info.endTime.slice(0, 10));
              if ((startDateString >= timeSlice && startDateString <= endTimeSlice)
                || (endDateString >= timeSlice && endDateString <= endTimeSlice)) {
                getIdQuery(data.UID);
              } else {
                console.log('搜尋結果：這段期間內沒有展演活動');
              }
            } else {
              console.log('搜尋結果：您附近沒有搜尋到展演活動');
            }
          });
        });
      });

    // const img = new Image();
    // img.src = `http://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=300x300&sensor=false`;

    // output.appendChild(img);
  };

  const error = () => {
    console.log('Unable to retrieve your location');
  };

  const getUserGeolocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(success, error);
  };

  const dateHandeler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <button type="button" onClick={getIdQuery}>拿test資料</button>
      <DatePicker
        selected={startDate}
        onChange={dateHandeler}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
      <button type="button" onClick={getUserGeolocation}>拿附近的展演資料</button>
    </>
  );
}

export default Entry;
