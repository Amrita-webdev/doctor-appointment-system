import '../App.css'
import React from 'react'

const Loader = ({ size }) => {
    return (
      <div
        className="spin-loader"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  export {Loader}

