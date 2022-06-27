import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.5);
  display: flex;
  justift-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 80%;
  height: 80%;
  background-color: white;
`;

function EventModal({ showModal }) {
  return (
    <Wrapper>
      <Modal style={{ display: showModal ? 'inline-block' : 'none' }} />
    </Wrapper>
  );
}

EventModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
};

export default EventModal;
