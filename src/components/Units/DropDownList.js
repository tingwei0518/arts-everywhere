import styled from 'styled-components/macro';
import down from '../../images/down.png';

const DropDownContainer = styled.div`
  width: 200px;
  margin: 0 auto;
  position: relative;
`;

const DropDownHeader = styled.div`
  height: 40px; 
  margin-bottom: 0;
  padding-bottom: 5px;
  font-size: 1.2rem;
  text-align: center;
  color: black;
  background-color: transparent;
  background-image: url(${down});
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: 97%;
  border-bottom: 2px solid black;
  cursor: pointer;
`;

const DropDownListContainer = styled.div`
  width: 200px;
  height: 200px;
  position: absolute;
  top: 40px;
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  background-color: rgba(51, 51, 51, 0.8);
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-align: center;
  height: 180px;
  overflow: auto;
  cursor: pointer;
  &:first-child {
    padding-top: 8px;
  }
`;

const ListItem = styled.li`
  list-style: none;
  margin-bottom: 8px;
`;

export {
  DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem,
};
