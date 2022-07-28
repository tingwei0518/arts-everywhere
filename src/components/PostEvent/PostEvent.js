/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useContext } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import styled from 'styled-components/macro';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseInit';
import UserContext from '../../UserContext';
import {
  Button, DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem,
} from '../Units';
import UploadImage from '../UploadImage';
import board from '../../assets/board.svg';
import 'react-datepicker/dist/react-datepicker.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditorImg = styled.img`
  width: 80%;
  align-self: flex-end;
  margin: 25px 60px 0 0;
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

const DatePickerWrapper = styled(({
  className, popperContainer, calendarContainer, field,
}) => (
  <DatePicker
    dateFormat="yyyy/MM/dd"
    popperContainer={popperContainer}
    calendarContainer={calendarContainer}
    wrapperClassName={className}
    onChange={(date) => field.onChange(date)}
    selected={field.value}
  />
))`
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
`;

const MainCalendar = styled.div`
  width: 243px;
  border-radius: 5px;
  box-shadow: 0 6px 12px rgba(27, 37, 86, 0.16);
  overflow: hidden;
  position: absolute;
  bottom: 40px;
`;

const DateTimePickerWrapper = styled(({
  className, popperContainer, calendarContainer, field,
}) => (
  <DatePicker
    dateFormat="yyyy/MM/dd  hh:mm"
    popperContainer={popperContainer}
    calendarContainer={calendarContainer}
    wrapperClassName={className}
    onChange={(date) => field.onChange(date)}
    selected={field.value}
    showTimeSelect
  />
))`
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
`;

const Calendar = styled.div`
  width: 328px;
  border-radius: 5px;
  box-shadow: 0 6px 12px rgba(27, 37, 86, 0.16);
  overflow: hidden;
`;

const Popper = styled.div`
  width:280px;
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
    eventContent.imageUrl = imgUrl;
    eventContent.startDate = dayjs(eventContent.startDate).format('YYYY/MM/DD');
    eventContent.endDate = dayjs(eventContent.endDate).format('YYYY/MM/DD');
    eventContent.showInfo.forEach((info, index) => {
      eventContent.showInfo[index].time = dayjs(info.time).format('YYYY/MM/DD HH:mm');
      eventContent.showInfo[index].endTime = dayjs(info.endTime).format('YYYY/MM/DD HH:mm');
    });
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
        toast('填寫標題、場次和日期');
      }
    } else {
      localStorage.setItem('event', JSON.stringify({ ...eventContent }));
      window.location.replace('./login');
    }
  };

  useEffect(() => {
    const unsubmittedEventContent = window.localStorage.getItem('event');
    if (!unsubmittedEventContent) return;
    const {
      title, descriptionFilterHtml, masterUnit, showUnit, website, img,
    } = JSON.parse(unsubmittedEventContent);
    reset({
      title,
      descriptionFilterHtml,
      masterUnit,
      showUnit,
      website,
    });
    setImgUrl(img);
  }, [reset]);

  return (
    <Wrapper>
      <PageTitle primary>Post Event</PageTitle>
      <EditorImg src={board} alt="" />
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
                  <DropDownList style={{ margin: '0', height: '118px' }}>
                    {Object.keys(categoryOptionsList).map((option) => (
                      <ListItem onClick={onOptionClicked(option)} key={option} style={{ zIndex: '6' }}>
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

          <LabelTitle htmlFor="startDate" style={{ zIndex: '5' }}>
            活動開始日期
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePickerWrapper
                  popperContainer={Popper}
                  calendarContainer={MainCalendar}
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  field={field}
                />
              )}
            />
          </LabelTitle>

          <LabelTitle htmlFor="endDate" style={{ zIndex: '5' }}>
            活動結束日期
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePickerWrapper
                  popperContainer={Popper}
                  calendarContainer={MainCalendar}
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  field={field}
                />
              )}
            />
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
                    <LabelTitle style={{ zIndex: '5' }}>
                      場次開始時間
                      <Controller
                        control={control}
                        {...register(`showInfo.${index}.time`)}
                        render={({ field }) => (
                          <DateTimePickerWrapper
                            popperContainer={Popper}
                            calendarContainer={Calendar}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            field={field}
                          />
                        )}
                      />
                    </LabelTitle>
                    <LabelTitle style={{ zIndex: '4' }}>
                      場次結束時間
                      <Controller
                        control={control}
                        {...register(`showInfo.${index}.endTime`)}
                        render={({ field }) => (
                          <DateTimePickerWrapper
                            popperContainer={Popper}
                            calendarContainer={Calendar}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            field={field}
                          />
                        )}
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
