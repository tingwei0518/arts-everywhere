/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import styled from 'styled-components/macro';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseInit';
import UserContext from '../../UserContext';
import {
  Button, DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem,
} from '../Units';
import UploadImage from '../UploadImage';
import board from '../../assets/board.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Editor = styled.form`
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

const SessionUl = styled.ul`
  list-style-type: none;
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

const SessionLi = styled.li`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 40px;
`;

const SessionNumber = styled.div`
  font-family: Times,sans-serif;
  font-size: 9rem;
  color: white;
  margin-bottom: 5px;
  position: absolute;
  bottom: -20px;
  right: 0;
`;

const LabelTitle = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  z-index: 2;
  input {
    width: 280px;
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

const defaultValues = {
  showInfo: [{
    time: '', endTime: '', locationName: '', location: '',
  }],
};

function PostEvent() {
  const currentUser = useContext(UserContext);
  const {
    control, register, handleSubmit, reset,
  } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'showInfo',
  });

  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('音樂');
  const [imgUrl, setImgUrl] = useState('');

  const categoryOptionsList = {
    音樂: '1', 戲劇: '2', 舞蹈: '3', 親子: '4', 獨立音樂: '5', 展覽: '6', 講座: '7', 電影: '8', 演唱會: '17', 研習課程: '19', 其他: '15',
  };

  const toggling = () => setIsOptionOpen(!isOptionOpen);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOptionOpen(false);
  };

  const onSubmit = (d) => {
    const eventContent = d;
    eventContent.category = categoryOptionsList[selectedOption];
    eventContent.imgUrl = imgUrl;
    if (currentUser.userId !== '') {
      if (eventContent.title !== '' && eventContent.startDate !== ''
        && eventContent.endDate !== '' && eventContent.showInfo.length !== 0) {
        const data = doc(collection(db, 'memberEvents'));
        setDoc(data, {
          ...eventContent,
          UID: data.id,
          memberId: currentUser.userId,
        });
        setImgUrl('');
        setSelectedOption('音樂');
        reset({
          title: '',
          descriptionFilterHtml: '',
          startDate: '',
          endDate: '',
          masterUnit: '',
          showUnit: '',
          website: '',
        });
        localStorage.removeItem('event');
      } else {
        alert('填寫標題、場次和日期');
      }
    } else {
      localStorage.setItem('event', JSON.stringify({ ...eventContent, img: imgUrl }));
      alert('請先登入，即將跳轉登入頁面');
      window.location.replace('./login');
    }
  };

  useEffect(() => {
    const unsubmittedEventContent = window.localStorage.getItem('event');
    console.log(unsubmittedEventContent);
    if (!unsubmittedEventContent) return;
    const {
      title, descriptionFilterHtml, startDate, endDate,
      masterUnit, showUnit, website, img,
    } = JSON.parse(unsubmittedEventContent);
    console.log(title);
    reset({
      title,
      descriptionFilterHtml,
      startDate,
      endDate,
      masterUnit,
      showUnit,
      website,
    });
    setImgUrl(img);
  }, [reset]);

  return (
    <Wrapper>
      <PageTitle primary>Post Event</PageTitle>
      <img src={board} alt="" style={{ width: '80%', alignSelf: 'flex-end', margin: '25px 60px 0 0' }} />
      <Editor onSubmit={handleSubmit(onSubmit)}>
        <BasicInformation>
          <Step>Step 1</Step>
          <LabelTitle htmlFor="title">
            活動名稱
            <input type="text" name="title" id="title" {...register('title')} />
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
              {...register('descriptionFilterHtml')}
            />
          </LabelTitle>

          <LabelTitle htmlFor="startDate">
            活動開始日期
            <input type="text" name="startDate" id="startDate" {...register('startDate')} />
          </LabelTitle>

          <LabelTitle htmlFor="endDate">
            活動結束日期
            <input type="text" name="endDate" id="endDate" {...register('endDate')} />
          </LabelTitle>

          <LabelTitle htmlFor="masterUnit">
            主辦單位
            <input type="text" name="masterUnit" id="masterUnit" {...register('masterUnit')} />
          </LabelTitle>

          <LabelTitle htmlFor="showUnit">
            活動單位
            <input type="text" name="showUnit" id="showUnit" {...register('showUnit')} />
          </LabelTitle>

          <LabelTitle htmlFor="website">
            活動網站
            <input type="text" name="website" id="website" {...register('website')} />
          </LabelTitle>
        </BasicInformation>
        <SessionWrapper>
          <Step>Step 2</Step>
          <LabelTitle htmlFor="session">
            活動場次
            <SessionUl>
              {
                fields.map((item, index) => (
                  <SessionLi key={item.id}>
                    <SessionNumber>
                      {
                        ((index + 1) >= 10) ? index + 1 : `0${index + 1}`
                      }
                    </SessionNumber>
                    <LabelTitle>
                      場次開始時間
                      <input
                        {...register(`showInfo.${index}.time`, {
                          required: true,
                        })}
                      />
                    </LabelTitle>
                    <LabelTitle>
                      場次結束時間
                      <input
                        {...register(`showInfo.${index}.endTime`, {
                          required: true,
                        })}
                      />
                    </LabelTitle>
                    <LabelTitle>
                      場地名稱
                      <input
                        {...register(`showInfo.${index}.locationName`, {
                          required: true,
                        })}
                      />
                    </LabelTitle>
                    <LabelTitle>
                      地址
                      <input
                        {...register(`showInfo.${index}.location`, {
                          required: true,
                        })}
                      />
                    </LabelTitle>
                    {
                      (index >= 1)
                      && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          style={{
                            width: '50px', justifyContent: 'center', margin: '0', padding: '2px 7px', backgroundColor: 'lightgrey', borderColor: 'lightgrey', borderRadius: '3px', position: 'absolute', top: '0px', right: '0', zIndex: '5',
                          }}
                        >
                          刪除
                        </Button>
                      )
                    }
                  </SessionLi>
                ))
              }
              <Button
                type="button"
                onClick={() => append({
                  time: '',
                  endTime: '',
                  locationName: '',
                  location: '',
                })}
                style={{
                  width: '90px', justifyContent: 'center', margin: '0', padding: '5px 10px', borderRadius: '3px',
                }}
              >
                增加場次
              </Button>
            </SessionUl>
          </LabelTitle>
        </SessionWrapper>
        <ImageBlock>
          <Step style={{ marginBottom: '15px' }}>Step 3</Step>
          <UploadImage imgUrl={imgUrl} setImgUrl={setImgUrl} />
          <Button
            style={{ justifyContent: 'center', marginTop: '25px', borderRadius: '3px' }}
          >
            <input
              type="submit"
              value="刊登活動資訊"
              style={{
                background: 'none', color: 'inherit', border: 'none', padding: '0', font: 'inherit', outline: 'inherit', cursor: 'pointer',
              }}
            />
          </Button>
        </ImageBlock>
      </Editor>
    </Wrapper>
  );
}

export default PostEvent;
