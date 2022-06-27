import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components/macro';
import title from '../../assets/title.svg';
import doubleNext from '../../images/double_next.png';
import Map from '../Map';

const Wrapper = styled.div`
  width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 70px;
  row-gap: 20px;
`;

const Block = styled.div`
  width: 50%;
  height: 25%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const bonbon = keyframes`
  0%   {transform: translateY(0%)}
  15%  {transform: translateY(-30%)}
  30%  {transform: translateY(0%)}
  55%  {transform: translateY(-10%)}
  100% {transform: translateY(0%)}
`;

const animation = (props) => css`
    ${bonbon} ${props.animationLength} linear 2s infinite;
`;

const AnimationBtn = styled.div`
  animation: ${animation};
  cursor: pointer;
`;

function FilterResults({
  latitude, longitude, filteredShowInfo, recentShowInfo, startDate, endDate,
  searchText, isFiltered, filteredEventsRef, scrollToElement,
}) {
  return (
    <Wrapper>
      <Block>
        <div style={{
          width: '100%', display: 'flex', alignItems: 'center', columnGap: '20px',
        }}
        >
          <img src={title} alt="arts everywhere" style={{ width: '250px' }} />
          <AnimationBtn onClick={() => scrollToElement(filteredEventsRef)}>
            <div style={{ fontSize: '.5rem' }}>click!</div>
            <img src={doubleNext} alt="next page" aria-hidden="true" style={{ width: '30px' }} />
          </AnimationBtn>
        </div>
        {
          !searchText ? (
            <div>
              <span>
                篩選時間
              </span>
              <span style={{ fontWeight: 'bold', borderBottom: '1px solid black' }}>
                {' '}
                {startDate.toLocaleDateString('zh-TW')}
                {' '}
                -
                {' '}
                {endDate.toLocaleDateString('zh-TW')}
              </span>
            </div>
          ) : (
            <div>
              <span>
                篩選關鍵字—
                {' '}
              </span>
              <span style={{ fontWeight: 'bold', borderBottom: '1px solid black' }}>
                {searchText}
              </span>
            </div>
          )
        }
      </Block>
      <Map
        latitude={latitude}
        longitude={longitude}
        showInfo={isFiltered ? filteredShowInfo : recentShowInfo}
      />
    </Wrapper>
  );
}

FilterResults.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  filteredShowInfo: PropTypes.arrayOf(PropTypes.shape({
    UID: PropTypes.string,
    title: PropTypes.string,
    info: PropTypes.shape({
      endTime: PropTypes.string,
      latitude: PropTypes.string,
      location: PropTypes.string,
      locationName: PropTypes.string,
      longitude: PropTypes.string,
      onSales: PropTypes.string,
      price: PropTypes.string,
      time: PropTypes.string,
    }).isRequired,
  })).isRequired,
  recentShowInfo: PropTypes.arrayOf(PropTypes.shape({
    UID: PropTypes.string,
    title: PropTypes.string,
    info: PropTypes.shape({
      endTime: PropTypes.string,
      latitude: PropTypes.string,
      location: PropTypes.string,
      locationName: PropTypes.string,
      longitude: PropTypes.string,
      onSales: PropTypes.string,
      price: PropTypes.string,
      time: PropTypes.string,
    }).isRequired,
  })).isRequired,
  searchText: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  isFiltered: PropTypes.bool.isRequired,
  filteredEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  scrollToElement: PropTypes.func.isRequired,
};

export default FilterResults;