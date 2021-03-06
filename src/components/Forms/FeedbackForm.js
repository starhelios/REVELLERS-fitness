// Customize this 'myform.js' script and add it to your JS bundle.
// Then import it with 'import MyForm from "./myform.js"'.
// Finally, add a <MyForm/> element whereever you wish to display the form.

import React from 'react';
import { Form } from 'react-bootstrap';
import Button from '../../styled_components/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import COLORS from '../../styles/color';
export default class MyForm extends React.Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.state = {
            status: '',
        };
    }

    render() {
        const { status } = this.state;
        return (
            <form
                onSubmit={this.submitForm}
                action="https://formspree.io/mqkykjpy"
                method="POST"
            >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name"></Form.Control>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email"></Form.Control>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        type="text"
                        as="textarea"
                        placeholder="How was your ride?"
                        name="message"
                    ></Form.Control>
                </Form.Group>

                {status === 'SUCCESS' ? (
                    <h4 style={{ fontWeight: 300 }}>
                        You're Amazing{' '}
                        <FontAwesomeIcon
                            style={{ color: COLORS.rust }}
                            icon={'heart'}
                        />
                    </h4>
                ) : (
                    <Button>
                        Submit{' '}
                        <FontAwesomeIcon
                            style={{ color: COLORS.dove_grey }}
                            icon={'paper-plane'}
                        />
                    </Button>
                )}
                {status === 'ERROR' && (
                    <p>Ooops! There was an error. Give it another go</p>
                )}
            </form>
        );
    }

    submitForm(ev) {
        ev.preventDefault();
        const form = ev.target;
        const data = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open(form.method, form.action);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
                form.reset();
                this.setState({ status: 'SUCCESS' });
            } else {
                this.setState({ status: 'ERROR' });
            }
        };
        xhr.send(data);
    }
}
