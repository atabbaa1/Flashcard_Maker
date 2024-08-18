// This route contains a simple sign-up page

import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

// The SignIn component from Clerk handles the actual sign-in process
export default function SignUpPage() {
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            Flashcard Maker
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Sign-in
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{textAlign: 'center', my: 4}}
        >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  )
}