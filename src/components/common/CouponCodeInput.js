import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import styles from '../../css/coupon.module.css';
const Coupon = ({ info }) => {
    const [showInfo, setInfo] = useState(false);
    const toggleInfo = () => {
        setInfo(showInfo => !showInfo);
    };
    return (
        <article className={styles.coupon}>
            <h4>
                Enter Coupon Code
                <button className={styles.btn} onClick={toggleInfo}>
                    {showInfo ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </h4>
            {showInfo && <input placeholder="Enter Code" />}
        </article>
    );
};

export default Coupon;
