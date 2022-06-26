import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import title from '../../assets/title.svg';
import Map from '../Map';

const Wrapper = styled.div`
  width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-right: 60px;
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

function FilterResults({
  latitude, longitude, filteredShowInfo, recentShowInfo, startDate, endDate, searchText, isFiltered,
}) {
  return (
    <Wrapper>
      <Block>
        <img src={title} alt="arts everywhere" style={{ width: '250px' }} />
        {
          !searchText ? (
            <div>
              篩選時間
              {startDate.toLocaleDateString('en-US')}
              —
              {endDate.toLocaleDateString('en-US')}
            </div>
          ) : (
            <div>
              篩選關鍵字—
              {searchText}
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
};

export default FilterResults;
