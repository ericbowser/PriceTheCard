/** @type {import('jest').Config} */
import React from 'react';
import {expect, it, describe, test, afterEach, jest} from '@jest/globals';
import {waitFor, render, getByText, getByLabelText, getByTestId} from '@testing-library/react';
import {defaults} from 'jest-config';
import Cards from '../Cards';
import Skills from "../Skills";

describe('the Card component', () => {
  it('renders Cards', () => {
    const {getAllByTestId} = render(<Cards/>);
    const cards = getAllByTestId('CardSkill');
    expect(cards.length).toBeGreaterThan(1);
  });
  
  it('renders Skills', () => {
    const {getAllByTestId} = render(<Skills/>);
    const cards = getAllByTestId('CardSkill');
    expect(cards.length).toBeGreaterThan(1);
  });
})