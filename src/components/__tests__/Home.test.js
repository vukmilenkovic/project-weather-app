import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '../Home';
import { MemoryRouter } from "react-router-dom";


describe('Home component', () => {
  test('renders Home component', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const inputField = screen.getByPlaceholderText("Enter a Location");
    expect(inputField).toBeInTheDocument();

    const tempElement = screen.getByText("Temp:");
    expect(tempElement).toBeInTheDocument();

    const cityElement = screen.getByText("City:");
    expect(cityElement).toBeInTheDocument();

    const feelsLike = screen.getByText("Feels like:");
    expect(feelsLike).toBeInTheDocument();

    const humidity = screen.getByText("humidity:");
    expect(humidity).toBeInTheDocument();

    const windSpeed = screen.getByText("Wind Speed");
    expect(windSpeed).toBeInTheDocument();
  });
  test('Checks if the data is displayed to the user', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const inputField = screen.getByPlaceholderText("Enter a Location");
    fireEvent.change(inputField, { target: { value: 'London' } });
    fireEvent.keyDown(inputField, { key: 'Enter' });
    await waitFor(() => {
      const cityElement = screen.getByText("London");
      expect(cityElement).toBeInTheDocument();
    });
  }
  );
  
});
