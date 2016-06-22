jest.unmock('../../../src/app/scenes/Home/Home.jsx');

import React from 'react';
import { render, unmountComponentAtNode as cleanup } from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import Home from '../../../src/app/scenes/Home/Home.jsx';

let shallowContent;
describe('<Home />', () => {
  const testingRootNode = document.body.appendChild(document.createElement('div'));
  const r = vdom => render(vdom, testingRootNode);

  afterEach(() => cleanup(testingRootNode));

  it('renders successfully', () => {
    expect(r(<Home />)).not.toBe(undefined);
  });
  it('should have a text header', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Home />);
    shallowContent = renderer.getRenderOutput();
    expect(shallowContent.props.children).toEqual(
        <h1>Home</h1>
    );
  });
});
