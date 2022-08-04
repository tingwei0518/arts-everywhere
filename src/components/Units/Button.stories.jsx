import React from 'react';

import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

function Template(args) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Button {...args} />;
}

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: '刊登活動吧',
};
