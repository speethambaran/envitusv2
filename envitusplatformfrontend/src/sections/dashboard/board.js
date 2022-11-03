import React from 'react';
import Home from './home/home';
const Board = () => {
    const dashboard = process.env.REACT_APP_DASHBOARD_TYPE;
    return (
        <Home />
    )
}


export default Board;
