/* eslint-disable no-console */
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import next from '../../images/white_next.png';
import {
  Button, DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem,
} from '../Units';
import 'react-datepicker/dist/react-datepicker.css';

const Wrapper = styled.div`
  width: 100vw;
  height: fit-content;
  display: flex;
  flex-direction: row;
  column-gap: 50px;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  top: 45%;
  left: 220px;

  @media screen and (max-width: 900px) {
    top: 40%;
    left: 300px;
  }

  @media screen and (max-width: 425px) {
    top: 30%;
    left: 30px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const MainFilter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 60px;
  column-gap: 20px;

  @media screen and (max-width: 425px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const KeywordFilter = styled.div`
  height: 200px;
  overflow: hidden;

  @media screen and (max-width: 425px) {
    height: 100px;
  }
`;

const KeywordInput = styled.input`
  width: 300px;
  font-size: 1.2rem;
  padding: 12px 20px;
  margin: 47px 8px 8px 350px;
  background: transparent;
  border: none;
  border-bottom: 2px solid black;
  &:focus {
    outline: none;
  }

  @media screen and (max-width: 425px) {
    margin: 50px 8px 8px 0px;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  align-items: center;
`;

const HintButton = styled.button`
  width: fit-content;
  height: fit-content;
  background: transparent;
  border: none;
  color: black;
  font-size: .9rem;
  text-align: center;
  border-bottom: 1px solid black;
  cursor: pointer;
`;

const DatePickerWrapper = styled(({
  className, popperContainer, calendarContainer, startDate, endDate, setStartDate, setEndDate,
}) => (
  <>
    <DatePicker
      dateFormat="yyyy/MM/dd"
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      selectsStart
      startDate={startDate}
      endDate={endDate}
      popperContainer={popperContainer}
      calendarContainer={calendarContainer}
      wrapperClassName={className}
    />
    <div>—</div>
    <DatePicker
      dateFormat="yyyy/MM/dd"
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      selectsEnd
      startDate={startDate}
      endDate={endDate}
      minDate={startDate}
      popperContainer={popperContainer}
      calendarContainer={calendarContainer}
      wrapperClassName={className}
    />
  </>
))`
  width: 100%;
  input {
    font-size: 1.2rem;
    width: fit-content;
    height: 40px;
    padding: 0;
    padding-bottom: 10px;
    color: black;
    text-align: center;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid black;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }

  @media screen and (max-width: 425px) {
    input {
      width: 150px;
      margin-bottom: 50px;
    }
  }
`;

const Calendar = styled.div`
  border-radius: 5px;
  box-shadow: 0 6px 12px rgba(27, 37, 86, 0.16);
  overflow: hidden;
`;

const Popper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

function Filter({
  startDate, endDate, setStartDate, setEndDate, location,
  locationHandeler, getFilteredEvents, searchHandeler, getKeywordQuery,
}) {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filterToggle, setFilterToggle] = useState(false);

  const toggling = () => setIsOptionOpen(!isOptionOpen);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOptionOpen(false);
    locationHandeler(value);
  };
  const locationOptionsList = [
    '台北市', '基隆市', '新北市', '宜蘭縣', '新竹市', '新竹縣', '桃園市', '苗栗縣', '台中市', '彰化縣',
    '南投縣', '嘉義市', '嘉義縣', '雲林縣', '台南市', '高雄市', '屏東縣', '台東縣', '花蓮縣',
  ];

  return (
    <Wrapper>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!filterToggle ? (
          <MainFilter>
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '10px' }}>
              <DatePickerWrapper
                popperContainer={Popper}
                calendarContainer={Calendar}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </div>
            <DropDownContainer>
              <DropDownHeader onClick={toggling}>
                {location || selectedOption}
              </DropDownHeader>
              {isOptionOpen && (
                <DropDownListContainer>
                  <DropDownList>
                    {locationOptionsList.map((option) => (
                      <ListItem onClick={onOptionClicked(option)} key={option}>
                        {option}
                      </ListItem>
                    ))}
                  </DropDownList>
                </DropDownListContainer>
              )}
            </DropDownContainer>
          </MainFilter>
        ) : (
          <KeywordFilter>
            <KeywordInput placeholder="請輸入您想搜尋的活動關鍵字" onChange={(e) => searchHandeler(e)} />
          </KeywordFilter>
        )}
      </div>
      <Buttons>
        <Button onClick={filterToggle ? getKeywordQuery : getFilteredEvents}>
          篩選活動
          <img src={next} alt="search" style={{ width: '8px' }} />
        </Button>
        <HintButton onClick={() => setFilterToggle(!filterToggle)}>
          {filterToggle ? '切換時間地點搜尋' : '切換關鍵字搜尋'}
        </HintButton>
      </Buttons>
    </Wrapper>
  );
}

Filter.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  locationHandeler: PropTypes.func.isRequired,
  getFilteredEvents: PropTypes.func.isRequired,
  searchHandeler: PropTypes.func.isRequired,
  getKeywordQuery: PropTypes.func.isRequired,
};

export default Filter;
