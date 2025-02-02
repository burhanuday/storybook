import React from 'react';
import pLimit from 'p-limit';
import { nanoid } from 'nanoid';

import { PartialStoryFn } from '@storybook/csf';
import { AngularFramework, StoryContext } from '..';
import { rendererFactory } from '../../renderer';

const limit = pLimit(1);

/**
 * Uses the angular renderer to generate a story. Uses p-limit to run synchronously
 */
export const prepareForInline = (
  storyFn: PartialStoryFn<AngularFramework>,
  { id, parameters, component }: StoryContext
) => {
  const el = React.useRef();

  React.useEffect(() => {
    (async () => {
      limit(async () => {
        const renderer = await rendererFactory.getRendererInstance(
          `${id}-${nanoid(10)}`.toLowerCase(),
          el.current
        );
        if (renderer) {
          await renderer.render({
            forced: false,
            component,
            parameters,
            storyFnAngular: storyFn(),
            targetDOMNode: el.current,
          });
        }
      });
    })();
  });

  return React.createElement('div', {
    ref: el,
  });
};
