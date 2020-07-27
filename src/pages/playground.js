import React from 'react';
import Button from '../styled_components';
const playground = () => {
    return (
        <div style={{ height: '100vh' }}>
            <article
                style={{
                    border: '1px solid grey',
                    boxShadow: '1px 1px 1px grey',
                    maxWidth: '400px',
                    minHeight: '200px',
                    margin: 'auto',
                    marginTop: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 5,
                }}
            >
                <h2>Enter Coupon Code</h2>
                <input
                    style={{
                        border: 'none',
                        borderBottom: '2px solid grey',
                        marginBottom: 30,
                    }}
                    placeholder="Enter Code"
                />
                <Button>Apply Code</Button>
            </article>
        </div>
    );
};

export default playground;
