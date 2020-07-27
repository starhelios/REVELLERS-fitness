import React from 'react';
import styled from 'styled-components';
import BackgroundImage from 'gatsby-background-image';
const StyledHero = ({ img, className, children, home }) => {
    return (
        <BackgroundImage className={className} fluid={img} home={home}>
            {children}
        </BackgroundImage>
    );
};

export default styled(StyledHero)`
    min-height: ${props => (props.home ? 'calc(100vh - 62px)' : '60vh')};
    background: ${props =>
        props.home
            ? 'linear-gradient(rgba(182,100,58,0.5), rgba(46,91,105,0.7))'
            : 'none'};
    background-position: right;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 1 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 375px) {
        background-position: left;
    }
`;
