import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ToolTip = ({ children, message, key }) => {
    return (
        <>
            <OverlayTrigger
                key={key}
                placement="bottom"
                overlay={
                    <Tooltip transition={true} id="tooltip-bottom">
                        {message}
                    </Tooltip>
                }
            >
                {children}
            </OverlayTrigger>
        </>
    );
};

export default ToolTip;
