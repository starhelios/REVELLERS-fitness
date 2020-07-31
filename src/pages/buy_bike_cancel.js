import React from 'react';
import Title from '../components/layout/Title';
import styles from '../css/success.module.css';
import { Link } from 'gatsby';
import Layout from '../components/layout/layout';
const Cancel = () => {
    return (
        <Layout>
            <section className={styles.about}>
                <Title title="Oh No! Did You Change" subtitle="Your Mind?" />

                <article className={styles.content}>
                    <p>We understand that this is a big commitment.</p>
                    <p>
                        Our team is always on hand to answer any questions or
                        address any concerns you may have.
                    </p>
                    <p>
                        Please send us an email to info@revelwell.com.au or use
                        our contact form on the website to arrange a time to
                        chat with one of the team.
                    </p>

                    <h5>The RevelWell Team</h5>

                    <Link fade to="/contact/">
                        <button className="btn-primary">Contact Us</button>
                    </Link>
                </article>
            </section>
        </Layout>
    );
};

export default Cancel;
