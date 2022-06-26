import styled, { keyframes } from 'styled-components/macro';
import visualText from '../../assets/visualText.svg';
import title from '../../assets/title.svg';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
`;

const HomeTitle = styled.div`
  position: absolute;
  bottom: 45px;
  left: 45px;
`;

const moveToRight = keyframes`
  from { transform: translate(0px, 0px); }
  to { transform: translate(500px, 0px); }
`;

const AnimationText = styled.div`
  position: absolute;
  top: 80px;
  animation-name: ${moveToRight};
  animation-delay: 0s;
  animation-duration: 10s;
  animation-timing-function: cubic-bezier(0.1, -0.6, 0.2, 0);
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  opacity: .8;
`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  background-color: rgb(255, 240, 0);
  border-radius: 50%;
`;

function HomeVisual() {
  return (
    <Wrapper>
      <AnimationText>
        <img src={visualText} alt="visualText" />
      </AnimationText>
      <HomeTitle>
        <img src={title} alt="arts everywhere" style={{ width: '500px' }} />
        <Circle />
      </HomeTitle>
    </Wrapper>
  );
}

export default HomeVisual;
