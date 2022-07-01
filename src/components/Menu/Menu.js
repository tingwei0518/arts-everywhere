import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  width: 300px;
  height: 100vh;
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  z-index: 3;
  box-shadow: 8px 0 5px rgba(0, 0, 0, 0.2);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  padding: 50px 30px;
`;

const MenuLists = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  & a {
    color: black;
    text-decoration: none;
  }
`;

function Menu({ isOpen, setIsOpen }) {
  return (
    <Wrapper isOpen={isOpen}>
      <MenuLists>
        <li onClick={() => setIsOpen(!isOpen)} aria-hidden="true">
          <Link to="/member">登入/註冊</Link>
        </li>
      </MenuLists>
    </Wrapper>
  );
}

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default Menu;
