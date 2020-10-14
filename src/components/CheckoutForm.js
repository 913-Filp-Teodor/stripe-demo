import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import "./checkout-form.scss";
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "24px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};
const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const customerId = JSON.parse(localStorage.customer).id;
    console.log(customerId);

    const createSubscription = async ({ customerId, paymentMethodId, priceId }) => {
        return fetch(
            'http://localhost:3000/create-subscription',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    priceId,
                    paymentMethodId
                }),
            })
            .then(response => response.json())
            .then(result => result.error ? console.log(result.error) : result)
            .then(result => ({ paymentMethodId, priceId, subscription: result }))
            // Some payment methods require a customer to be on session
            // to complete the payment process. Check the status of the
            // payment intent to handle these actions.
            .then(/*handlePaymentThatRequiresCustomerAction*/)
            // If attaching this card to a Customer object succeeds,
            // but attempts to charge the customer fail, you
            // get a requires_payment_method error.
            .then(/*handleRequiresPaymentMethod*/)
            // No more actions required. Provision your service for the user.
            .then(/*onSubscriptionComplete*/(subscription) => console.log(subscription))
            .catch(err => console.log(err));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements)
            return;

        const cardElement = elements.getElement(CardElement);

        const latestInvoicePaymentIntentStatus = localStorage.latestInvoicePaymentIntentStatus;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        });

        if (error)
            return console.log('error: ', error);

        // console.log('paymentMethod: ', paymentMethod);
        const paymentMethodId = paymentMethod.id;
        if (latestInvoicePaymentIntentStatus === "requires_payment_method") {
            const invoiceId = localStorage.latestInvoiceId;
            //retry invoice with new payment method
        } else {
            createSubscription({ customerId, paymentMethodId, priceId: 'price_1HH3w9Gev2lIfPl9qbzAHLbu' })
        }
    }

    return (
        <form className="card-details-wrapper" onSubmit={handleSubmit}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            <button type="submit">Pay</button>
        </form>
    )
}

export default CheckoutForm;