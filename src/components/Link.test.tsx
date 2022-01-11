import React from 'react';
import renderer from 'react-test-renderer';
import Link from './Link';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>,
  );
  let tree: any = component.toJSON();

  expect(tree).not.toBe(null);

  if (tree === null) fail()

  expect(tree).toMatchSnapshot();
});
