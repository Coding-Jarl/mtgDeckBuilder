import { Prisma } from '@prisma/client'

declare global {
  namespace DB {
    type Deck = Omit<Prisma.DeckGetPayload<object>, 'idAuthor'>
    type Decks = Array<Deck>
    type DeckQuery = Partial<{
      name: string
      description: string
      idAuthor: string
    }>

    type CardInDeck = Prisma.CardInDeckGetPayload<object>

    type Card = Prisma.CardGetPayload<object>
    type Cards = Array<Card>

    type CardWithDecks = Prisma.CardGetPayload<{
      include: {
        usedInDecks: {
          select: {
            deck: true
            count: true
          }
        }
      }
    }>
    type CardsWithDecks = Array<CardWithDecks>

    type DeckWithCards = Prisma.DeckGetPayload<{
      include: {
        contents: {
          select: {
            card: true
            count: true
          }
        }
      }
    }>
    type DecksWithCards = Array<DeckWithCards>
  }
}
