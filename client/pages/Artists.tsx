import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, Outlet, Routes, Route, useNavigate } from 'react-router-dom';
import { ArtistContext } from '../context/ArtistContext'; // imports context

const Artists = () => {
  const {artist, setArtist} = useContext(ArtistContext);
  
  const updateArtist = () => {
    setArtist({
      id: 1044650045,
      userId: 348934234234758923745,
      artistName: 'Mariah',
    });
  };
  const navigate = useNavigate();
  useEffect(() => {
    updateArtist();
  }, []);

  return (
    <div>
      <div>Hello ARtists</div>
      {artist.artistName}
      <button onClick={() => {
        navigate('/');
      }}>Go home</button>
    </div>
  );
};

export default Artists;
