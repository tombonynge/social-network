import React from 'react';
import App from './app';
import { render, waitForElement } from '@testing-library/react';
import axios from './axios';

jest.mock('./axios');

test('App shows nothing at first and then renders div after all async stuff is done', async () => {
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            firstname: 'tom',
            lastname: 'bonynge',
            url: '/blah.jpg',
            bio: 'hello'
        }
    })

    const { container } = render(<App />);
    expect(container.children.length).toBe(0);
    await waitForElement(() => container.querySelector('div'));
    expect(container.children.length).toBe(1);

})