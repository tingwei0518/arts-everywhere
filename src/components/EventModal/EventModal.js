import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import close from '../../images/close.png';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.3);
  display: ${(props) => (props.showModal ? 'flex' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 80%;
  height: 80%;
  background-color: white;
  position: relative;
  text-align: center;
`;

const CloseBtn = styled.div`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 25px;
  right: 25px;
  background-image: url(${close});
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
`;

function EventModal({ event, showModal, closeModal }) {
  return (
    <Wrapper showModal={showModal}>
      <Modal>
        <CloseBtn onClick={closeModal} />
        <div style={{ marginTop: '20px' }}>{event.title}</div>
        <div>
          {event.startDate}
          -
          {event.endDate}
        </div>
        <div style={{ border: '1px solid black', marginTop: '20px' }}>
          {
            event.showInfo.map((info) => (
              <div>
                <div>{info.location}</div>
                <div>
                  {info.time}
                  -
                  {info.endTime}
                </div>
              </div>
            ))
          }
        </div>

      </Modal>
    </Wrapper>
  );
}

EventModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

EventModal.propTypes = {
  event: PropTypes.shape({
    showInfo: PropTypes.arrayOf(PropTypes.shape({
      endTime: PropTypes.string,
      latitude: PropTypes.string,
      location: PropTypes.string,
      locationName: PropTypes.string,
      longitude: PropTypes.string,
      onSales: PropTypes.string,
      price: PropTypes.string,
      time: PropTypes.string,
    })),
    version: PropTypes.string,
    UID: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    showUnit: PropTypes.string,
    discountInfo: PropTypes.string,
    descriptionFilterHtml: PropTypes.string,
    imageUrl: PropTypes.string,
    masterUnit: PropTypes.arrayOf(PropTypes.string),
    subUnit: PropTypes.arrayOf(PropTypes.string),
    supportUnit: PropTypes.arrayOf(PropTypes.string),
    otherUnit: PropTypes.arrayOf(PropTypes.string),
    webSales: PropTypes.string,
    sourceWebPromote: PropTypes.string,
    comment: PropTypes.string,
    editModifyDate: PropTypes.string,
    sourceWebName: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    hitRate: PropTypes.number,
    keywords: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default EventModal;
