import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseInit';
import UserContext from '../../UserContext';
import api from '../../utils/api';
import { Button } from '../../components/Units';
import background from '../../assets/background8.svg';

const HomeBtn = styled.div`
  position: fixed;
  bottom: 30px;
  left: 40px;
  width: 52px;
  height: 52px;
  background-color: rgb(255, 240, 0);
  margin-right: 16px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Times,sans-serif; 
  cursor: pointer;
  z-index: 2;
  a{
    text-decoration: none;
    color: black;
  }

  @media screen and (max-width: 800px) {
    bottom: 10px;
    left: 10px;
  }
`;

const Background = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
`;

const Wrapper = styled.div`
  width: 80%;
  min-width: 320px;
  height: 80%;
  background-color: white;
  padding: 50px;
  display: flex;
  flex-direction: row;
  z-index: 1;

  @media screen and (max-width: 800px) {
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 30px;
  }
`;

const UserInfo = styled.div`
  height: 100%;
  font-size: 1rem;
  border-right: 1px solid black;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 800px) {
    border-right: none;
    align-items: flex-start;
  }
`;

const BasicInfo = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 1.1rem;
  text-align: left;
  font-weight: bold;
  margin: 10px 0;
`;

const Event = styled.div`
  cursor: pointer;
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1.5px solid black;
  div {
    width: 80px;
    height: fit content;
    font-size: 1rem;
    color: #0e0e0e;
    text-align: left;
    margin-left: 10px;
  }
`;

const EventLists = styled.div`
  margin-top: 20px;
  overflow-y: auto;

  @media screen and (max-width: 800px) {
    margin-top: 10px;
  }
`;

const EventDetails = styled.div`
  width: 100%;
  padding: 0 30px;
  overflow-y: auto;

  @media screen and (max-width: 800px) {
    padding: 0;
    margin-top: 20px;
    border-top: 3px solid black;
  }
`;

function ProfilePage() {
  const [userSubmittedEvent, setUserSubmittedEvent] = useState([]);
  const [showSubmittedEventIndex, setShowSubmittedEventIndex] = useState(0);
  const currentUser = useContext(UserContext);
  const eventData = [];

  const deleteEvent = (uid) => {
    deleteDoc(doc(db, 'memberEvents', uid));
    const newUserSubmittedEvent = userSubmittedEvent.filter((event) => event.UID !== uid);
    setUserSubmittedEvent(newUserSubmittedEvent);
  };

  async function getUserSubmittedEvents(UID) {
    const querySnapshot = await api.userSubmittedEventsQuery(UID);
    querySnapshot.forEach((dataDoc) => {
      eventData.push(dataDoc.data());
    });
    setUserSubmittedEvent(eventData);
  }

  useEffect(() => {
    getUserSubmittedEvents(currentUser.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Background>
      <HomeBtn>
        <Link to="/">Home</Link>
      </HomeBtn>
      <Wrapper>
        <UserInfo>
          <BasicInfo>
            <Title>個人檔案</Title>
            <div>
              暱稱
              {' '}
              {currentUser.userName}
            </div>
            <div>
              信箱
              {' '}
              {currentUser.email}
            </div>
          </BasicInfo>
          <EventLists>
            <Title>刊登活動紀錄</Title>
            {
              userSubmittedEvent.map((event, index) => (
                <Event onClick={() => setShowSubmittedEventIndex(index)}>
                  {event?.title}
                </Event>
              ))
            }
          </EventLists>
        </UserInfo>
        <EventDetails>
          <Title>{userSubmittedEvent[showSubmittedEventIndex]?.title}</Title>
          <Title>
            {userSubmittedEvent[showSubmittedEventIndex]?.startDate}
            {
              (userSubmittedEvent[showSubmittedEventIndex]?.startDate
                !== userSubmittedEvent[showSubmittedEventIndex]?.endDate)
              && (` - ${userSubmittedEvent[showSubmittedEventIndex]?.endDate}`)
            }
          </Title>
          <img
            src={userSubmittedEvent[showSubmittedEventIndex]?.imageUrl}
            alt="event"
            style={{ width: '100%' }}
          />
          <Title>{userSubmittedEvent[showSubmittedEventIndex]?.masterUnit[0]}</Title>
          <Title>{userSubmittedEvent[showSubmittedEventIndex]?.showUnit}</Title>
          <br />
          {userSubmittedEvent[showSubmittedEventIndex]?.descriptionFilterHtml}
          <Title>活動場次</Title>
          {
            userSubmittedEvent[showSubmittedEventIndex]?.showInfo.map((info) => (
              <div style={{ borderBottom: '1px solid black', padding: '10px 0' }}>
                {info?.time}
                {' - '}
                {info?.endTime}
                <br />
                {info?.location}
                <br />
                {info?.locationName}
              </div>
            ))
          }
          <Button
            type="button"
            onClick={() => deleteEvent(userSubmittedEvent[showSubmittedEventIndex].UID)}
            style={{
              width: '100px', justifyContent: 'center', margin: '10px 0px 10px auto', padding: '2px 7px', backgroundColor: 'lightgrey', borderColor: 'lightgrey', borderRadius: '3px',
            }}
          >
            刪除活動
          </Button>
        </EventDetails>
      </Wrapper>
    </Background>
  );
}

export default ProfilePage;
