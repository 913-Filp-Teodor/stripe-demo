import React, { useState } from 'react';
import './form.scss';
import { useHistory } from 'react-router-dom';

const CreateCustomerForm = (props) => {

    const history = useHistory();

    const [email, setEmail] = useState("");
    const [customer, setCustomer] = useState(null);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        return fetch('http://localhost:3000/create-customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(response => response.json())
            .then(result => {
                setCustomer(result.customer);
                localStorage.customer = JSON.stringify(result.customer);
                history.push('/checkout');
            });
    }

    return (
        <form id="signup-form" onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address" />
            </div>
            <button type="submit">
                Sign up
            </button>
        </form>
    )
}

export default CreateCustomerForm;