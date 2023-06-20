import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


// TODO: Implent the useEffect function in the code below


export default function Home() {
  const url = 'http://localhost:3001/weather';
  const [weatherData, setWeatherData] = useState({});
  
  const [inputValue, setInputValue] = useState('');
  const unit = 'metric';

  const handleKeyDown = event => {
    

    if (event.key === 'Enter') {
      event.preventDefault();
      
      getCityData(inputValue);
      
    }
  };

  const getCityData = (inputValue) => {
    // Make the API calls in this function
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&appid=697d265aafcbaba7178a649d9c3e40f4`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
           // Make the second API call and return the promise
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=697d265aafcbaba7178a649d9c3e40f4`);
          }
        })
        .then((res) => res.json())
        .then((data) => {
          // Access the data from the second API call and perform further actions
          setWeatherData(data);
          postDataToDb(data);
          // Assign the data from the API call to the variables
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const postDataToDb = (weatherData) => {
      const dataToPost = {
        // Specify the data you want to send to the database
        city: weatherData.name,
        temp: weatherData.main?.temp,
        wind: weatherData.wind.speed,
        temp_min: weatherData.main?.temp_min,
        temp_max: weatherData.main?.temp_max,
        humidity: weatherData.main?.humidity
      };

      // Check if the city already exists in the database
      fetch(`${url}?city=${weatherData.name}`)
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.length > 0) {
            // City already exists, so update the data for that city
            const cityId = responseData[0].id;
            fetch(`${url}/${cityId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dataToPost),
            })
              .then((response) => response.json())
              .then((updatedData) => {
                console.log('Data updated in the database:', updatedData);
              })
              .catch((error) => {
                console.log('Error updating data:', error);
              });
          } else {
            // City doesn't exist, so add the data as a new entry
            fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dataToPost),
            })
              .then((response) => response.json())
              .then((newData) => {
                
                console.log('New data posted to the database:', newData);
              })
              .catch((error) => {
                console.log('Error posting data:', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error checking if city exists:', error);
        });
    };
    
  
        return (
         
          <div className="container-all">
            <div className="app">
              <div className="search">
                <input 
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Enter a Location'
              name="" 
              id="city-input"
              />
            </div>
            
          <div className="container">
            <div className="top">
              <div className="location">
                <h2>City:</h2>
                <h1>{weatherData.name}</h1>
              </div>
              <div className="temp">
                <h2>Temp:</h2>
                <h1>{weatherData.main?.temp}</h1>
              </div>
              <div className="description">
                <p>{weatherData.weather?.[0]?.description}</p>
              </div>
            </div>
            <div className="middle">
              <Link to="/graph" style={{ color: 'white', textDecoration: 'none' }}>Graph</Link>
            </div>
            <div className="bottom">
              <div className="feels">
                <p>Feels like:</p>
                <p className='bold'>{weatherData.main?.feels_like}</p>
              </div>
              <div className="humidity">
                <p>humidity:</p>
                <p className='bold'>{weatherData.main?.humidity}</p>
              </div>
              <div className="wind">
                <p>Wind Speed</p>
                <p className='bold'>{weatherData.wind?.speed}</p>
              </div>
            </div>
          </div>
        </div>
       </div>
        
    );

    }

