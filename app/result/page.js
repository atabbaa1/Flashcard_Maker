"use client"

// This route handles the post-payment process and displays
// the outcome to the user

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Container, CircularProgress, Typography, Box } from "@mui/material";
import getStripe from "@/utils/get-stripe";

const ResultPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)
  
  // The below fetches the checkout session when the component mounts
  // or when session_id changes. 
  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return
      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
        const sessionData = await res.json()
        if (res.ok) {
          setSession(sessionData)
        } else {
          setError(sessionData.error)
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.')
      } finally {
        setLoading(false)
      }
    }
    fetchCheckoutSession()
  }, [session_id])
  
  // While the session data is being fetched, a loading indicator is displayed
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <CircularProgress />
        <Typography variant="h6" sx={{mt: 2}}>
          Loading...
        </Typography>
      </Container>
    )
  }

  // If an error occurs during fetch, display the error message
  if (error) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    )
  }

  // Display the final result. If the payment is successful, show
  // a thank-you message and the session id
  return (
    <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
      {session.payment_status === 'paid' ? (
        <>
          <Typography variant="h4">Thank you for your purchase!</Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with the
              order details shortly.
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment failed</Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="body1">
              Your payment was not successful. Please try again.
            </Typography>
          </Box>
        </>
      )}
    </Container>
  )
}

export default ResultPage