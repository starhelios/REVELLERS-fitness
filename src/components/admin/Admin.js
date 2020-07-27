import React, { useEffect, useState } from 'react';
import { Row, Table } from 'react-bootstrap';
import fetchAllCustomerSubscriptions from '../../utils/fetchAllCustomerSubscriptions';
import { useIdentityContext } from 'react-netlify-identity';

const Admin = () => {
    const { user } = useIdentityContext();
    const [data, setData] = useState({});
    const [uniqueUsers, setUniqueUsers] = useState({});

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
        fetch(
            'https://api.netlify.com/api/v1/sites/ce8112a3-4226-4a01-bbc2-04d07d68b671/identity/5e9846a499408ae63f5ea386/users?page=1&per_page=100&sort=created_at&sort=created_at&access_token=a67c2c006dc0582ff99c3d3b0412e138650ef6d36b6cf16a338e94dfea841f09&per_page=150',
            requestOptions
        )
            .then(response => response.json())
            .then(users => {
                setData(users);
                const uniqueUsers = users?.reduce(
                    (accumulatedUniqueUsers, { email }) => {
                        accumulatedUniqueUsers[email] = 1;
                        return accumulatedUniqueUsers;
                    },
                    {}
                );
                setUniqueUsers(uniqueUsers);
                fetchAllCustomerSubscriptions({ users, currentUser: user })
                    .then(res => res.json())
                    .then(({ usersBySubscription = {} }) => {
                        console.log({ usersBySubscription });
                        const { data: usersWithSubscriptions } =
                            usersBySubscription.subscriptions || {};
                        console.log({ usersWithSubscriptions });

                        usersWithSubscriptions.forEach(
                            ({ status, customer }) => {
                                const userToUpdate = users.find(
                                    ({ user_metadata }) => {
                                        return (
                                            user_metadata.stripeId === customer
                                        );
                                    }
                                );
                                if (userToUpdate) {
                                    userToUpdate.status = status;
                                    setData([...users, { ...userToUpdate }]);
                                }
                            }
                        );
                    });
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <Row className="px-3">
            <h3 className="my-4">
                Total users: {data?.length} | Total unique users:{' '}
                {Object.entries(uniqueUsers).length}
            </h3>
            <Table striped bordered hover style={{ textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Package</th>
                        <th>Joined</th>
                        <th>StripeId</th>
                        <th>Payment Status</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) &&
                        data.map(
                            (
                                {
                                    id,
                                    created_at,
                                    email,
                                    user_metadata,
                                    status,
                                },
                                index
                            ) => {
                                const {
                                    full_name,
                                    userPackage,
                                    stripeId,
                                } = user_metadata;

                                const joinedDate = created_at
                                    ? new Date(created_at)
                                    : new Date();
                                const joinedYear = joinedDate.getFullYear();
                                const joinedMonth = joinedDate.getMonth() + 1;
                                const joinedDay = joinedDate.getDate();
                                const userFriendlyDate = `${joinedDay}/${joinedMonth}/${joinedYear}`;

                                return (
                                    <tr key={`${id}-${index}`}>
                                        <td>{!!full_name && full_name}</td>
                                        <td>{!!email && email}</td>
                                        <td>{!!userPackage && userPackage}</td>
                                        <td>
                                            {!!created_at && userFriendlyDate}
                                        </td>
                                        <td>{!!stripeId && stripeId}</td>
                                        <td>{!!status && status}</td>
                                    </tr>
                                );
                            }
                        )}
                </tbody>
            </Table>
        </Row>
    );
};

export default Admin;
