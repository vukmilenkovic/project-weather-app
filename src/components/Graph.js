import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';


// TODO: Make appropriate changes to the code below, so that the graphs are not drawn as soon as the component is rendered, but rather after the data is fetched from the database
const Graph = () => {
  // Create a state for the data from the database
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

// Clean up the code below
  useEffect(() => {
    fetch('http://localhost:3001/weather')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setDataFetched(true);
        if (dataFetched) {
          const randomCitiesData = getRandomCitiesData(data, 5);
          createGraph(randomCitiesData);
          const windData = getWindSpeedData(data, 5);
          createWindSpeedGraph(windData);
        }
    })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }, [dataFetched]);
     

  const getWindSpeedData = (data, count) => {
    // write a function that returns an object containing the city and the wind speed
    const randomCities = [];
    const cities = data.map((cityData) => cityData.city);
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * cities.length);
      randomCities.push(cities[randomIndex]);
    }
    // return the the array that will be used to display the graph
    return randomCities.map((city) => {
      const cityData = data.find((cityData) => cityData.city === city);
      return {
        city: cityData.city,
        wind: cityData.wind,
      };
    }
    );
  };


  const getRandomCitiesData = (data, count) => {
    const randomCities = [];
    const cities = data.map((cityData) => cityData.city);
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * cities.length);
      randomCities.push(cities[randomIndex]);
    }


    // return the the array that will be used to display the graph
    return randomCities.map((city) => {
      const cityData = data.find((cityData) => cityData.city === city);
      return {
        city: cityData.city,
        temperature: cityData.temp,
        wind: cityData.wind,
      };
    }
    );

    

  };
  // Display the cities from the database on the x axis
  // Display the temperature from the database on the y axis
  
  // Display the temperature as a line chart
  // Display the cities as the labels on the x axis and represent them as bars

  const createGraph = (data) => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .range([height, 0]);
    
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const svg = d3.select('#graph')
      .append('svg')
      .attr('data-testid', 'graph1')
      .attr('width', width + margin.left + margin.right + 100)
      .attr('height', height + margin.top + margin.bottom + 100)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Add a heading to the graph
      svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - (margin.top / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-decoration', 'underline')
      .text('Temperature in cities');
    
    
    x.domain(data.map((d) => d.city));
    y.domain([0, 50]);

    // Add the x axis to the graph
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-.8em')
      .attr('dy', '.25em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .style('font-weight', 'bold');     

    // Add the y axis to the graph
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text', 'Temperature (Celsius)')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('dy', '-3em')
      .style('text-anchor', 'middle');
      


    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.city))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.temperature))
      .attr('height', (d) => height - y(d.temperature))
      .attr('fill', 'red');
  };

  const createWindSpeedGraph = (data) => {
    
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .range([height, 0]); 
    
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right + 100)
      .attr('height', height + margin.top + margin.bottom + 100)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add a heading to the graph
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - (margin.top / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Wind Speed (km/h)');


    x.domain(data.map((d) => d.city));
    y.domain([0, d3.max(data, (d) => d.wind)]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-.8em')
      .attr('dy', '.25em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .style('font-weight', 'bold');      

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('dy', '-3em')
      .style('text-anchor', 'middle')
      .text('Wind Speed (km/h)');

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.city))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.wind))
      .attr('height', (d) => height - y(d.wind))
      .attr('fill', 'steelblue');
    
  };

  
  
  
  
  return (
    <div>
      <h1>Weather Graphs</h1>
      <div id="graph" data-testid="graph">
        

      </div>
    </div>
  );
};

export default Graph;

