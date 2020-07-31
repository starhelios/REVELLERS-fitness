import React from 'react';
import styles from '../../css/footer.module.css';
import { menuOptions } from '../../data/footer.js';
import socialIcons from '../../data/icons';
import { Link } from 'gatsby';
const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.links}>
                {menuOptions.map((link, index) => {
                    return (
                        <Link fade key={index} to={link.slug}>
                            {link.title}
                        </Link>
                    );
                })}
            </div>
            <div className={styles.icons}>
                {socialIcons.map((icon, index) => {
                    return (
                        <a
                            key={index}
                            href={icon.url}
                            target="_blank"
                            aria-label="social media icon"
                            rel="noopener noreferrer"
                        >
                            {icon.icon}
                        </a>
                    );
                })}
            </div>
            <div className={styles.copyright}>
                copyright &copy; RevelWell PTY LTD {new Date().getFullYear()}
            </div>
        </footer>
    );
};

export default Footer;
