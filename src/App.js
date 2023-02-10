import React from 'react';
import Navbar from './components/Navbar/Navbar'
import Map from './components/Map/Map';
import NewMap from './components/NewMap';




export default function App() {

  return (
   <div>
    <Navbar />
    <NewMap />
   </div>
  );
}