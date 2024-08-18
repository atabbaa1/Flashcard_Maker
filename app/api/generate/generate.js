// This route generates the flashcards (as JSON) given the user text.

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator. You take in text and create multiple flashcards from it.
The front should be a couple words, and the back can be up to 2 sentences long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": str,
      "back": str
    }
  ]
}
Amazing flashcards contain a term in the front. The back is a corresponding definition of the term.
For example, in a set of flashcard for the organ systems in the human body, a great flashcard for
the cardiovascular system would be:
{
  "flashcards": [
    {
      "front": "Cardiovascular System",
      "back": "The organ system responsible for supplying the body with oxygen and nutriens via blood. Main organs include the heart and blood vessels"
    }
  ]
}
The flashcard front terms should be unique, and the back terms should not cover similar information.
`

export async function POST(req) {
  const openai = new OpenAI()
  console.log("I got here")
  const data = await req.text()

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  })

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content)

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)

}