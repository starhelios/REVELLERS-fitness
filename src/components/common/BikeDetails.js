import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import styles from '../../css/bikedetails.module.css';
const Day = ({ info }) => {
    const [showInfo, setInfo] = useState(false);
    const toggleInfo = () => {
        setInfo(showInfo => !showInfo);
    };
    return (
        <article className={styles.day}>
            <h4>
                Details
                <button className={styles.btn} onClick={toggleInfo}>
                    {showInfo ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </h4>
            {showInfo && <p>{info}</p>}
        </article>
    );
};

export default Day;
