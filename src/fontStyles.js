import { createGlobalStyle } from 'styled-components';
import CormorantBold from './styles/Cormorant-Bold.ttf';
import CormorantMedium from './styles/Cormorant-Medium.ttf';
import CormorantRegular from './styles/Cormorant-Regular.ttf';

const FontStyles = createGlobalStyle`

@font-face {
  font-family: CormorantBold;
  src: url(${CormorantBold}))
}

@font-face {
  font-family: CormorantMedium;
  src: url(${CormorantMedium}))
}

@font-face {
  font-family: CormorantRegular;
  src: url(${CormorantRegular}))
}
`;

export default FontStyles;
