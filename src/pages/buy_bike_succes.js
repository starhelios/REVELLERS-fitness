import React from 'react';
import Title from '../components/layout/Title';
import styles from '../css/success.module.css';
import { Link } from 'gatsby';
import Layout from '../components/layout/layout';
const Success = () => {
    return (
        <Layout>
            <section className={styles.about}>
                <Title title="You Bought A" subtitle="Bike!" />

                <article className={styles.content}>
                    <p>
                        It's confirmed! Your order has been received and is
                        being processed by our team.
                    </p>
                    <p>
                        We will be sending you a receipt shortly, as well as
                        contacting you to confirm delivery timeframes.
                    </p>

                    <p>
                        Your 1 Month Free RevelWell Pass with be included in the
                        delivery of the bike.
                    </p>

                    <p>We are super excited to have you part of the crew.</p>

                    <h5>The RevelWell Team</h5>

                    <Link fade to="/">
                        <button className="btn-primary">Home</button>
                    </Link>
                </article>
            </section>
        </Layout>
    );
};

export default Success;
