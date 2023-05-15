import { Prisma } from '@prisma/client'

declare global {
  namespace DB {
    type Deck = Omit<Prisma.DeckGetPayload<object>, 'idAuthor'>
    type DeckQuery = Partial<{
      name: string
      description: string
      idAuthor: string
    }>

    type CardInDeck = Prisma.CardInDeckGetPayload<object>

    type Card = Prisma.CardGetPayload<object>

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
  }
}
