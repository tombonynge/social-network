import React from 'react';
import ProfilePic from './profilepic';
import { render, fireEvent } from '@testing-library/react';

test('renders img with src set to url prop', () => {
    const { container } = render(
        <ProfilePic
            pic='/fakeimage.jpg'
        />
    )
    expect(container.querySelector('img').getAttribute('src')).toBe('/fakeimage.jpg');

});

test(`renders img with src set to './ blank_profile.png' when no url prop is passed`, () => {
    const { container } = render(
        <ProfilePic />
    )
    expect(container.querySelector('img').getAttribute('src')).toBe('./blank_profile.png');

});

test(`does the onClick function work`, () => {
    const mockOnClick = jest.fn();
    const { container } = render(<ProfilePic toggleModal={mockOnClick} />);
    fireEvent.click(container.querySelector('button'));
    expect(mockOnClick.mock.calls.length).toBe(1);

})