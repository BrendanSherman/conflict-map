import React from 'react';

function Header() {
    return (
        <header style={{
            backgroundColor: '#0A2472',
            color: 'white',
            padding: '10px 20px',
            textAlign: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <h1 style={{margin: 0}}>Global Conflict Map: Test Version</h1>
        </header>
    );
}

export default Header;