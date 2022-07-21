import { useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from '../../UserContext';
import barCode from '../../assets/barcode.svg';
import title from '../../assets/title.svg';
import menuBackground from '../../assets/menu.svg';

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

  @media screen and (max-width: 450px) {
    filter: none;
  }
`;

const Copyright = styled.div`
  font-size: .8rem;

  @media screen and (max-width: 450px) {
    font-size: .6rem;
  }
`;

const BarCode = styled.img`
  width: 200px;
`;

const MenuTitle = styled.img`
  width: 200px;
  margin-top: 80px;

  @media screen and (max-width: 450px) {
    margin-top: 50px;
  }
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

  @media screen and (max-width: 450px) {
    font-size: 1rem;
  }
`;

const FIRST_PAGE_POSITION = 0;
const SECOND_PAGE_POSITION = 1450;
const THIRD_PAGE_POSITION = 1960;
const FOURTH_PAGE_POSITION = 3320;
const FIFTH_PAGE_POSITION = 4680;
const SIXTH_PAGE_POSITION = 6040;
const SEVENTH_PAGE_POSITION = 7400;

function Menu({
  isOpen, setIsOpen, isFiltered, setScrolled, isMobileScreen,
}) {
  const currentUser = useContext(UserContext);
  const auth = getAuth();
  const screenWidth = window.innerWidth;

  return (
    <Wrapper isOpen={isOpen}>
      <Copyright>Copyright © 2022 Arts Everywhere</Copyright>
      <BarCode src={barCode} alt="barcode" />
      <MenuTitle src={title} alt="arts everywhere" />
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
        <li onClick={isMobileScreen ? () => setScrolled(screenWidth) : () => setScrolled(SECOND_PAGE_POSITION)} aria-hidden="true">
          搜尋結果地圖
        </li>
        {
          isFiltered
          && (
            <li onClick={isMobileScreen ? () => setScrolled(screenWidth * 2) : () => setScrolled(THIRD_PAGE_POSITION)} aria-hidden="true">
              篩選活動
            </li>
          )
        }

        {
          isMobileScreen ? (
            <>
              <li onClick={isFiltered ? () => setScrolled(screenWidth * 3) : () => setScrolled(screenWidth * 2)} aria-hidden="true">
                近期活動
              </li>
              <li onClick={isFiltered ? () => setScrolled(screenWidth * 4) : () => setScrolled(screenWidth * 3)} aria-hidden="true">
                熱門活動
              </li>
              <li onClick={isFiltered ? () => setScrolled(screenWidth * 5) : () => setScrolled(screenWidth * 4)} aria-hidden="true">
                會員刊登活動
              </li>
              <li onClick={isFiltered ? () => setScrolled(screenWidth * 6) : () => setScrolled(screenWidth * 5)} aria-hidden="true">
                活動刊登編輯區
              </li>
            </>
          ) : (
            <>
              <li onClick={isFiltered ? () => setScrolled(FOURTH_PAGE_POSITION) : () => setScrolled(THIRD_PAGE_POSITION)} aria-hidden="true">
                近期活動
              </li>
              <li onClick={isFiltered ? () => setScrolled(FIFTH_PAGE_POSITION) : () => setScrolled(FOURTH_PAGE_POSITION)} aria-hidden="true">
                熱門活動
              </li>
              <li onClick={isFiltered ? () => setScrolled(SIXTH_PAGE_POSITION) : () => setScrolled(FIFTH_PAGE_POSITION)} aria-hidden="true">
                會員刊登活動
              </li>
              <li onClick={isFiltered ? () => setScrolled(SEVENTH_PAGE_POSITION) : () => setScrolled(SIXTH_PAGE_POSITION)} aria-hidden="true">
                活動刊登編輯區
              </li>
            </>
          )
        }
        <li onClick={() => setScrolled(FIRST_PAGE_POSITION)} aria-hidden="true">
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
  setScrolled: PropTypes.func.isRequired,
  isMobileScreen: PropTypes.bool.isRequired,
};

export default Menu;
