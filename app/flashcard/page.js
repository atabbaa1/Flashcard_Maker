'use client'

// This route displays individual flashcards inside a flashcard set

import { Container, Grid, Card, CardActionArea, CardContent, Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
import { doc, getDocs, collection } from "firebase";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {database} from "../../firebase/firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser() // useUser is for authentication
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  // Fetch the flashcard set from Firestore when the component
  // mounts or when the search or user changes
  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
  
      const colRef = collection(doc(collection(database, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [search, user])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }
  
  // This allows for flipping of the flashcards
  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
              <CardContent>
                    <Box sx={{
                      perspective: '1000px',
                      '& > div': {
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        transform: flipped[index] ? 'rotateX(180deg)' : 'rotateX(0deg)',
                      },
                      '& > div > div': {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        padding: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                      },
                      '& > div > div:nth-of-type(2)': {
                        transform: 'rotateX(180deg)',
                      },
                    }}
                    >
                      <div>
                        <div>
                          <Typography variant="h6">{flashcard.front}</Typography>
                        </div>
                        <div>
                          <Typography variant="h6" sx={{ mt: 2 }}>{flashcard.back}</Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}