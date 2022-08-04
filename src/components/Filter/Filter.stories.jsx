/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { createGlobalStyle } from 'styled-components';

import Filter from './Filter';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

export default {
  title: 'Filter',
  component: Filter,
};

function Template(args) {
  return (
    <>
      <GlobalStyle />
      <Filter {...args} />
    </>
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
};
