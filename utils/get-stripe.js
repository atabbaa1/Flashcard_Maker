// This utility function gets the Stripe instance.
// This is used for client-side operations and ensures
// we only create one instance of Stripe, reusing it
// if it already exists.

import { loadStripe } from "@stripe/stripe-js"

let stripePromise

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export default getStripe