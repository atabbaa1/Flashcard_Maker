'use client'
// This serves as the landing page for the entire Flashcard Maker application

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {Box, Container, Typography, AppBar, Toolbar, Button, Grid} from "@mui/material";
import Head from "next/head";

export default function Home() {
  
  
  // This function handles the Stripe checkout process when a user selects the Pro plan
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  
  return (
    <Container maxWidth="lg">
      <Head>
        <title> Flashcard Maker </title>
        <meta name="FlashCard Maker" content="Summarize text into flashcards"></meta>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}} href="page">
            Flashcard Maker
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard Maker
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}}>
          Learn More
        </Button>
      </Box>

      <Box sx={{my: 6, alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <Typography variant="h4" component="h2" gutterBottom>Reviews</Typography>
        <Grid container spacing={4} alignItems={"center"}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              "Very Intuitive and easy to use"
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              "I am a medical-school student, and I use this all the time. Better than ANKI!"
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              "I no longer read lecture notes anymore. I just plug them into this Flashcard Maker."
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom> Free </Typography>
              <Typography variant="h6" component="h2" gutterBottom> $0 / month </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                {""}
                <ul>
                  <li>AI summarizes text into flashcards.</li>
                  <li>No capability for saving flashcard sets.</li>
                </ul>
              </Typography>
              <Button variant="contained" color="primary"> Choose Free </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom> Pro </Typography>
              <Typography variant="h6" component="h2" gutterBottom> $10 / month </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                {""}
                <ul>
                  <li>AI summarizes text into flashcards.</li>
                  <li>Support for saving flashcard sets.</li>
                </ul>
              </Typography>
              <Button variant="contained" color="primary" onClick={handleSubmit}> Choose Pro </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
