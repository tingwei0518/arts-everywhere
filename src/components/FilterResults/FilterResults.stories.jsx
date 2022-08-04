/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import filterBg from '../../assets/filter-bg2.svg';

import FilterResults from './FilterResults';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const SubPage = styled.div`
  min-width: 600px;
  height: 100vh;
  display: inline-block;
  background-image: url(${filterBg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;

  @media screen and (max-width: 450px) {
    width: 100vw;
    min-width: 320px;
    background-size: auto;
  }
`;

export default {
  title: 'FilterResults',
  component: FilterResults,
};

function Template(args) {
  return (
    <SubPage>
      <GlobalStyle />
      <FilterResults {...args} />
    </SubPage>
  );
}

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  startDate: new Date(),
  endDate: new Date(),
  setStartDate: () => { },
  setEndDate: () => { },
  location: '台北市',
  locationHandeler: () => { },
  getFilteredEvents: () => { },
  searchHandeler: () => { },
  getKeywordQuery: () => { },
  latitude: 25.038703857114204,
  longitude: 121.5324140125928,
  setLatitude: () => { },
  setLongitude: () => { },
  filteredShowInfo: [],
  recentShowInfo: [],
};
