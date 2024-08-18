// This route contains a simple sign-in page

import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

// The SignIn component from Clerk handles the actual sign-in process
export default function SignUpPage() {
  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            Flashcard Maker
          </Typography>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign-up
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
          Sign In
        </Typography>
        <SignIn />
      </Box>
    </Container>
  )
}