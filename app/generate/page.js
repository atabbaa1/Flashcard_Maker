'use client'
// This route is the page where users can enter text
// This route calls other routes (api/generate) to generate the flashcards


import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  CardActionArea,
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material'
import database from "../../firebase/firebase";
import { collection, getDoc, doc, writeBatch } from "firebase/firestore";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const handleOpenDialog = () => setDialogOpen(true)
const handleCloseDialog = () => setDialogOpen(false)

export default function Generate() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [text, setText] = useState("")
  const [name, setName] = useState("")
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const {isLoaded, isSignedIn, user} = useUser()
  const router = useRouter()

  // Calls the API which, generates the flashcards, and updates the flashcards
  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      fetch('api/generate', {
        method: 'POST',
        body: text,
      }).then((res) => res.json()).then((data) => setFlashcards(data)) 
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }


  // Saves the flashcards to Firebase
  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }
  
    try {
      const batch = writeBatch(database)
      const userDocRef = doc(collection(database, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      if (userDocSnap.exists()) {
        const collections = userDocSnap.data().flashcards || []
        if (collections.find((f) => f.name == name)) {
          alert("There is already a flashcard set with this same name. Use another name and try again")
          return
        } else {
          collections.push({name})
          batch.set(userDocRef, {flashcards: collections}, {merge: true})

        }
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: name }] })
      }
  
      const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
      })
 
      alert('Flashcards saved successfully!')
      await batch.commit()
      handleCloseDialog()
      router.push("/flashcards")

    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  // This method allows for flipping of the cards when clicked
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      
    {flashcards.length > 0 && (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Generated Flashcards
        </Typography>
        <Grid container spacing={2}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => {handleCardClick(index)}}>
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
      </Box>
    )}
    {flashcards.length > 0 && (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Save Flashcards
        </Button>
      </Box>
    )}

    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Save Flashcard Set</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your flashcard set.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Set Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={saveFlashcards} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>

    </Container>
  )
}