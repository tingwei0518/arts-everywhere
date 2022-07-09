import { useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
// import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import UserContext from '../../UserContext';
import barCode from '../../assets/barcode.svg';
import title from '../../assets/title.svg';
import menuBackground from '../../assets/menu.svg';
// import slash from '../../images/slash.svg';

const Wrapper = styled.div`
  width: 300px;
  height: 100vh;
  position: fixed;
  background-image: url(${menuBackground});
  background-size: cover;
  background-position: right 5%;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
  z-index: 4;
  filter: drop-shadow(8px 0 5px rgba(0, 0, 0, 0.2));
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
`;

// const TodayDate = styled.div`
//   font-size: 3rem;
//   font-family: Times,sans-serif;
//   text-align: right;
//   color: rgba(255, 255, 255, .8);
//   background-image: url(${slash});
//   background-size: cover;
//   background-position: top 5px;
//   background-repeat: no-repeat;
//   position: absolute;
//   bottom: 4%;
//   right: 13%;
//   span {
//     display: block;
//     font-size: 2rem;
//   }
// `;

const Copyright = styled.div`
  font-size: .8rem;
`;

const MenuLists = styled.ul`
  height: fit-content;
  list-style: none;
  margin: 20px 0 0 -30px;
  padding: 13px 0 0 20px;
  border-left: .9px solid black;
  font-size: 1.1rem;
  & a {
    color: black;
    text-decoration: none;
  }
  li {
    margin-bottom: 13px;
    cursor: pointer;
    :hover {
      font-weight: bold;
    }
  }
  button {
    :hover{
      font-weight: bold;
    }
  }
`;

function Menu({
  isOpen, setIsOpen, isFiltered,
  scrollToElement, homeRef, filteredInfoRef,
  filteredEventsRef, recentEventsRef, popularEventsRef, userEventsRef, userEventsEditorRef,
}) {
  const currentUser = useContext(UserContext);
  const auth = getAuth();
  // const monthsName = [
  // eslint-disable-next-line max-len
  //   'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
  // ];
  // const month = monthsName[Number(dayjs().format('M')) - 1];
  // const day = dayjs().format('DD');

  return (
    <Wrapper isOpen={isOpen}>
      <Copyright>Copyright © 2022 Arts Everywhere</Copyright>
      <img src={barCode} alt="barcode" style={{ width: '200px' }} />
      <img src={title} alt="arts everywhere" style={{ width: '200px', marginTop: '80px' }} />
      {/* <TodayDate>
        {month}
        <span>{day}</span>
      </TodayDate> */}
      <MenuLists>
        {
          (currentUser.userId === '')
            ? (
              <li onClick={() => setIsOpen(!isOpen)} aria-hidden="true">
                <Link to="/login">登入/註冊</Link>
              </li>
            ) : (
              <li onClick={() => setIsOpen(!isOpen)} aria-hidden="true">
                <Link to="/profile">{`會員專區(${currentUser.userName})`}</Link>
              </li>
            )
        }
        <li onClick={() => scrollToElement(filteredInfoRef)} aria-hidden="true">
          搜尋結果地圖
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
          會員刊登活動
        </li>
        <li onClick={() => scrollToElement(userEventsEditorRef)} aria-hidden="true">
          活動刊登編輯區
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
                style={{
                  fontSize: '1rem', padding: '0', border: 'none', background: 'none', cursor: 'pointer',
                }}
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
