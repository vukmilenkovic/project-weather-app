import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Graph from "../Graph";

describe('Home component', () => {
    test('renders Home component', () => {
      render(
        <MemoryRouter>
          <Graph />
        </MemoryRouter>
      );
    
    
      // Check if the input field is rendered
      const headerElement = screen.getByText("Weather Graphs");
      expect(headerElement).toBeInTheDocument();
    });
    test('Checks if the graphs are displayed to the user', async () => {
        render(
            <MemoryRouter>
              <Graph />
            </MemoryRouter>
          );
       // Check if the graphs are rendered
         const graphElement = screen.getByTestId("graph");
         expect(graphElement).toBeInTheDocument();

        
  });
  
});
  