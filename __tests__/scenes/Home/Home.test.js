jest.unmock('../../../src/app/scenes/Home/Home.jsx');

import React from 'react';
import { render, unmountComponentAtNode as cleanup } from 'react-dom';
import Home from '../../../src/app/scenes/Home/Home.jsx';

describe('<Home />', () => {
  const testingRootNode = document.body.appendChild(document.createElement('div'));
  const r = vdom => render(vdom, testingRootNode);

  afterEach(() => cleanup(testingRootNode));

  it('renders successfully', () => {
    expect(r(<Home />)).not.toBe(undefined);
  });
});
