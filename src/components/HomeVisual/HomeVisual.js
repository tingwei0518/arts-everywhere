import styled, { keyframes } from 'styled-components/macro';
import visualText from '../../assets/visualText.svg';
import title from '../../assets/title.svg';

const Wrapper = styled.div`
  width: 100vw;
  min-width: 1360px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
`;

const HomeTitle = styled.div`
  position: absolute;
  bottom: 100px;
  left: 45px;

  img {
    width: 500px;
  }

  @media screen and (max-width: 900px) {
    img {
      width: 400px;
    }
  }

  @media screen and (max-width: 450px) {
    bottom: none;
    top: 70px;
    left: 30px;
    img {
      width: 300px;
    }
  }
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

function HomeVisual() {
  return (
    <Wrapper>
      <AnimationText>
        <img src={visualText} alt="visualText" />
      </AnimationText>
      <HomeTitle>
        <img src={title} alt="arts everywhere" />
      </HomeTitle>
    </Wrapper>
  );
}

export default HomeVisual;
