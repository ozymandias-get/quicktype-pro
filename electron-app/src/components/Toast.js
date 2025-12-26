import React from 'react';

function Toast({ message, type }) {
    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
}

export default Toast;
