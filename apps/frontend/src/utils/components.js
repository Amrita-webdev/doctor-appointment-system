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

  const Button = ({children, handleSubmit, color, backgroundColor, fontStyle}) => {
    return (
        <button className='button__style' style={{ color: color, backgroundColor: backgroundColor, fontStyle: fontStyle }} onClick={handleSubmit}>
            {children}
        </button>
    )
  }

  export {Loader, Button}

