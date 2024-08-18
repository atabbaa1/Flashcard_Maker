'use client'

// This route is responsible for fetching and displaying
// all of the user's saved flashcard sets

import { setDoc, getDoc, collection } from "firebase/firestore";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser() // useUser is for authentication
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter() // useRouter is for navigation

  // Retrieves the flashcards from Firestore
  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }
    getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  // When the user clicks on a flashcard set, move to the route
  // /flashcard using the selected flashcard set's ID
  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}} href="../page">
            Flashcard Maker
          </Typography>
          <Button color="inherit" href="/sign-in">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => {
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        })}
      </Grid>
    </Container>
  )
}