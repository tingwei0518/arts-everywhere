import { useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from '../../UserContext';

const Wrapper = styled.div`
  width: 300px;
  height: 100vh;
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  z-index: 4;
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
  li {
    margin-bottom: 10px;
    cursor: pointer;
  }
`;

function Menu({
  isOpen, setIsOpen, isFiltered,
  scrollToElement, homeRef, filteredInfoRef,
  filteredEventsRef, recentEventsRef, popularEventsRef, userEventsRef, userEventsEditorRef,
}) {
  const currentUser = useContext(UserContext);
  const auth = getAuth();

  return (
    <Wrapper isOpen={isOpen}>
      <MenuLists>
        {
          (currentUser.userId === '')
            ? (
              <li onClick={() => setIsOpen(!isOpen)} aria-hidden="true">
                <Link to="/login">登入/註冊</Link>
              </li>
            ) : (
              <li onClick={() => setIsOpen(!isOpen)} aria-hidden="true">
                <Link to="/profile">會員專區</Link>
              </li>
            )
        }
        <li onClick={() => scrollToElement(filteredInfoRef)} aria-hidden="true">
          結果地圖
        </li>
        {
          isFiltered
          && (
            <li onClick={() => scrollToElement(filteredEventsRef)} aria-hidden="true">
              篩選活動
            </li>
          )
        }
        <li onClick={() => scrollToElement(recentEventsRef)} aria-hidden="true">
          近期活動
        </li>
        <li onClick={() => scrollToElement(popularEventsRef)} aria-hidden="true">
          熱門活動
        </li>
        <li onClick={() => scrollToElement(userEventsRef)} aria-hidden="true">
          會員活動
        </li>
        <li onClick={() => scrollToElement(userEventsEditorRef)} aria-hidden="true">
          刊登編輯區
        </li>
        <li onClick={() => scrollToElement(homeRef)} aria-hidden="true">
          回首頁
        </li>
        {
          (currentUser.userId !== '')
          && (
            <li onClick={() => setIsOpen(!isOpen)} aria-hidden="true">
              <button
                type="submit"
                onClick={() => signOut(auth).then(() => {
                  console.log('Sign-out successful.');
                }).catch((error) => {
                  console.log(error);
                })}
              >
                登出
              </button>
            </li>
          )
        }
      </MenuLists>
    </Wrapper>
  );
}

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isFiltered: PropTypes.bool.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  homeRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  filteredInfoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  filteredEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  recentEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  popularEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  userEventsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  userEventsEditorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

export default Menu;
