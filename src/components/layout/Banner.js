import React from 'react';
import styles from '../../css/banner.module.css';
import SVG from '../../images/REVELWELL- Main-Logo-All White.svg';
const Banner = ({ title, info, children, home }) => {
    return (
        <div className={styles.banner}>
            {home ? (
                <img src={SVG} alt="RevelWell LogoSVG" />
            ) : (
                <>
                    <h1>{title}</h1>
                    <p>{info}</p>
                </>
            )}
            {children}
        </div>
    );
};

export default Banner;
