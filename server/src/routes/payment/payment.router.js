const { Router } = require("express");
const express = require('express');

const PaymentRouter = Router();

const { httpPaymentIntent, httpWebhook } = require('./payment.controller');

//Routes
PaymentRouter.post("/create-payment-intent", express.json(),httpPaymentIntent)
PaymentRouter.post("/webhook",express.raw({type: 'application/json'}),httpWebhook)

module.exports = PaymentRouter;