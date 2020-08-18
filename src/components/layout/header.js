import React, { useContext, useEffect } from 'react';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { Navbar, Nav, Form } from 'react-bootstrap';
import { IoIosLogOut, IoIosContact } from 'react-icons/io';
import { useIdentityContext } from 'react-netlify-identity';

import Button from '../../styled_components';
import COLORS from '../../styles/color';
import { menuOptions } from '../../data/menu.js';
import { GlobalDispatchContext } from '../../context/GlobalContextProvider';
import Logo from '../../images/logo_light.png';
import styles from '../../css/header.module.css';

const Header = ({ siteTitle, pathName }) => {
    const {
        user,
        isLoggedIn,
        logoutUser,
        isConfirmedUser,
    } = useIdentityContext();

    const dispatch = useContext(GlobalDispatchContext);
    //const state = useContext(GlobalStateContext);

    useEffect(() => {
        dispatch({
            type: 'LOG_IN',
            netlify: isLoggedIn,
            user,
        });
    }, [isLoggedIn]);

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">
                <img src={Logo} height={30} alt="RevelWell Logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {menuOptions.map(option => {
                        const { title, slug, isPrivateRoute } = option;
                        return (
                            <Link
                                to={isPrivateRoute ? `/app${slug}` : slug}
                                style={{
                                    color: COLORS.rust,
                                    fontSize: '1rem',
                                }}
                                className="p-2"
                                key={slug}
                            >
                                {title}
                            </Link>
                        );
                    })}
                </Nav>
                <Form inline>
                    {isLoggedIn ? (
                        isConfirmedUser && (
                            <>
                                <Link
                                    to="/app/profile"
                                    className={styles.icons}
                                >
                                    <IoIosContact />
                                </Link>

                                <Link
                                    className={styles.icons}
                                    to="/login/"
                                    onClick={event => {
                                        event.preventDefault();
                                        logoutUser(() => navigate(`/login`));
                                    }}
                                    key="logout"
                                >
                                    <IoIosLogOut />
                                </Link>
                            </>
                        )
                    ) : (
                        <>
                            <Link to="/signup/" key="signup">
                                <Button signup className="mr-3">
                                    Sign Up
                                </Button>
                            </Link>
                            <Link to="/login/" key="login">
                                <Button login>Login</Button>
                            </Link>
                        </>
                    )}
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};

Header.propTypes = {
    siteTitle: PropTypes.string,
};

Header.defaultProps = {
    siteTitle: ``,
};

export default Header;
