import { useState, useRef } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseInit';
import {
  Button, DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem,
} from '../Units';
import UploadImage from '../UploadImage';
import board from '../../assets/board.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.div`
  position: absolute;
  top: 215px;
  left: 250px;
  display: flex;
  flex-direction: row;
  letter-spacing: 2px;
`;

const PageTitle = styled.div`
  font-size: 6rem;
  font-family: Times,sans-serif; 
  padding: 40px 10px 0 60px;
  color: ${(props) => (props.primary ? 'darkgrey' : 'white')};
`;

const Step = styled.div`
  font-family: Times,sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const BasicInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  height: 375px;
  overflow-y: auto;
  margin-right: 20px;
  border-right: 1px solid grey;
`;

const SessionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  height: 375px;
  overflow-y: auto;
  margin-right: 20px;
  border-right: 1px solid grey;
`;

const SessionLists = styled.div`
  width: 310px;
  padding: 15px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  background-color: rgba(255, 255, 255, .5);
`;

const ImageBlock = styled.div`
  display: flex;
  flex-direction: column;
  height: 375px;
`;

const SessionForm = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SessionNumber = styled.div`
  font-family: Times,sans-serif;
  font-size: 9rem;
  color: white;
  margin-bottom: 5px;
  position: absolute;
  bottom: 15px;
  right: 0;
`;

const LabelTitle = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  z-index: 2;
  input {
    width: 300px;
    height: 30px;
    font-size: 1rem;
    color: #0e0e0e;
    text-align: left;
    border: none;
    background-color: transparent;
    border-bottom: 1.5px solid black;
    &:focus {
      outline: none;
    }
  }
  textarea {
    width: 300px;
    min-height: 80px;
    margin-top: 5px;
    border: none;
    background-color: rgba(255, 255, 255, .5);
    resize: vertical;
    &:focus {
      outline: none;
    }
  }
`;

function SessionEditor({
  timeRef, endTimeRef, locationNameRef, locationRef, number,
}) {
  return (
    <SessionForm>
      <SessionNumber>
        {
          number >= 10
            ? number : `0${number}`
        }
      </SessionNumber>
      <LabelTitle htmlFor="time">
        場次開始時間
        <input type="text" name="time" id="time" ref={timeRef} style={{ width: '280px' }} required />
      </LabelTitle>
      <LabelTitle htmlFor="endTime">
        場次結束時間
        <input type="text" name="endTime" id="endTime" ref={endTimeRef} style={{ width: '280px' }} required />
      </LabelTitle>
      <LabelTitle htmlFor="locationName">
        場地名稱
        <input type="text" name="locationName" id="locationName" ref={locationNameRef} style={{ width: '280px' }} required />
      </LabelTitle>
      <LabelTitle htmlFor="location" style={{ marginBottom: '50px' }}>
        地址
        <input type="text" name="location" id="location" ref={locationRef} style={{ width: '280px' }} required />
      </LabelTitle>
    </SessionForm>
  );
}

SessionEditor.propTypes = {
  timeRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  endTimeRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  locationNameRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  locationRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  number: PropTypes.number.isRequired,
};

function PostEvent() {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('音樂');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [masterUnit, setMasterUnit] = useState([]);
  const [showUnit, setShowUnit] = useState('');
  const [website, setWebsite] = useState('');
  const [sessionValues, setSessionValues] = useState([]);
  const [sessionCounter, setSessionCounter] = useState(1);

  const timeRef = useRef(null);
  const endTimeRef = useRef(null);
  const locationNameRef = useRef(null);
  const locationRef = useRef(null);

  const categoryOptionsList = {
    音樂: '1', 戲劇: '2', 舞蹈: '3', 親子: '4', 獨立音樂: '5', 展覽: '6', 講座: '7', 電影: '8', 演唱會: '17', 研習課程: '19', 其他: '15',
  };

  const toggling = () => setIsOptionOpen(!isOptionOpen);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOptionOpen(false);
  };

  const postToFirestore = () => {
    setSessionValues({
      time: timeRef.current.value,
      endtime: endTimeRef.current.value,
      locationName: locationNameRef.current.value,
      location: locationRef.current.value,
    });
    if (title !== '') {
      const data = doc(collection(db, 'memberEvents'));
      setDoc(data, {
        UID: data.id,
        category: categoryOptionsList[selectedOption],
        title,
        descriptionFilterHtml: description,
        startDate: '',
        endDate: '',
        imageUrl: imgUrl,
        masterUnit,
        showUnit,
        website,
        showInfo: sessionValues,
        memberId: 'test',
      });
    }
  };

  return (
    <Wrapper>
      <PageTitle primary>Post Event</PageTitle>
      <img src={board} alt="" style={{ width: '80%', alignSelf: 'flex-end', margin: '25px 60px 0 0' }} />
      <Form>
        <BasicInformation>
          <Step>Step 1</Step>
          <LabelTitle htmlFor="title">
            活動名稱
            <input type="text" name="title" id="title" required onChange={(e) => setTitle(e.target.value)} />
          </LabelTitle>

          <LabelTitle
            htmlFor="category"
            style={{
              flexDirection: 'row', margin: '5px 0 10px 0', alignItems: 'center', zIndex: '5',
            }}
          >
            活動類型
            <DropDownContainer style={{ width: '100px', margin: '0 0 0 20px' }}>
              <DropDownHeader
                onClick={toggling}
                style={{
                  width: '100px', height: '24px', paddingRight: '10px', backgroundSize: '15px 15px', fontSize: '1rem', borderBottom: '1.5px solid black', color: '#0e0e0e',
                }}
              >
                {selectedOption}
              </DropDownHeader>
              {isOptionOpen && (
                <DropDownListContainer style={{ width: '100px', top: '24px' }}>
                  <DropDownList style={{ margin: '0' }}>
                    {Object.keys(categoryOptionsList).map((option) => (
                      <ListItem onClick={onOptionClicked(option)} key={option}>
                        {option}
                      </ListItem>
                    ))}
                  </DropDownList>
                </DropDownListContainer>
              )}
            </DropDownContainer>
          </LabelTitle>

          <LabelTitle htmlFor="desc">
            活動細節
            <textarea
              type="text"
              name="desc"
              id="desc"
              onChange={(e) => setDescription(e.target.value)}
            />
          </LabelTitle>

          <LabelTitle htmlFor="masterUnit">
            主辦單位
            <input type="text" name="masterUnit" id="masterUnit" onChange={(e) => setMasterUnit(e.target.value)} />
          </LabelTitle>

          <LabelTitle htmlFor="showUnit">
            活動單位
            <input type="text" name="showUnit" id="showUnit" onChange={(e) => setShowUnit(e.target.value)} />
          </LabelTitle>

          <LabelTitle htmlFor="website">
            活動網站
            <input type="text" name="website" id="website" onChange={(e) => setWebsite(e.target.value)} />
          </LabelTitle>
        </BasicInformation>
        <SessionWrapper>
          <Step>Step 2</Step>
          <LabelTitle htmlFor="session">
            活動場次
            <SessionLists>
              {
                Array.from(Array(sessionCounter), (_, i) => (
                  <SessionEditor
                    key={i}
                    timeRef={timeRef}
                    endTimeRef={endTimeRef}
                    locationNameRef={locationNameRef}
                    locationRef={locationRef}
                    number={i + 1}
                  />
                ))
              }
              <div style={{
                width: '200px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
              }}
              >
                {
                  sessionCounter >= 2
                  && (
                    <Button
                      onClick={() => setSessionCounter(sessionCounter - 1)}
                      style={{
                        width: '90px', justifyContent: 'center', margin: '0', padding: '5px 10px',
                      }}
                    >
                      減少一場
                    </Button>
                  )
                }
                <Button
                  onClick={() => setSessionCounter(sessionCounter + 1)}
                  style={{
                    width: '90px', justifyContent: 'center', margin: '0', padding: '5px 10px',
                  }}
                >
                  增加一場
                </Button>
              </div>
            </SessionLists>
          </LabelTitle>
        </SessionWrapper>
        <ImageBlock>
          <Step style={{ marginBottom: '15px' }}>Step 3</Step>
          <UploadImage imgUrl={imgUrl} setImgUrl={setImgUrl} />
          <Button onClick={postToFirestore} style={{ justifyContent: 'center', marginTop: '25px' }}>刊登活動資訊</Button>
        </ImageBlock>
      </Form>
    </Wrapper>
  );
}

export default PostEvent;
