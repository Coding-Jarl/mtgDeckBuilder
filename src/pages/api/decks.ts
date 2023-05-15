import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export async function listDecks({
  name = '',
  description = '',
  idAuthor = '',
}: DB.DeckQuery) {
  const prisma = new PrismaClient()
  const decks = prisma.deck.findMany({
    where: {
      OR: {
        name: { contains: name },
        description: { contains: description },
        idAuthor: Number(idAuthor) || undefined,
      },
    },
    include: {
      contents: {
        select: {
          card: true,
          count: true,
        },
      },
      author: true,
    },
  })
  return decks
}
export async function createDeck({
  name,
  description,
  idAuthor,
  cards,
}: {
  name: string
  description: string
  idAuthor: number
  cards: Array<{
    id: string
    uuid: string
    name: string
    count: number
  }>
}) {
  const prisma = new PrismaClient()

  await prisma.card.createMany({
    data: cards.map((card) => ({ name: card.name, uuid: card.uuid })),
    skipDuplicates: true,
  })

  const allCards = await prisma.card.findMany({
    where: {
      uuid: { in: cards.map((card) => card.uuid) },
    },
  })

  const newDeck = prisma.deck.create({
    data: {
      description: description,
      name: name,
      author: {
        connect: {
          id: idAuthor,
        },
      },
      contents: {
        createMany: {
          data: cards.map((card) => ({
            count: card.count,
            idCard: allCards.find((candidate) => candidate.uuid === card.uuid)
              ?.id as number,
          })),
          skipDuplicates: true,
        },
      },
    },
    select: {
      description: true,
      name: true,
      id: true,
      author: true,
    },
  })

  return newDeck
}
// DeckCreation = Omit<NonNullable<Prisma.DeckSelect>, 'id'>
// type Data = Awaited<ReturnType<typeof getCards>>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DB.Deck | DB.DecksWithCards>
) {
  switch (req.method) {
    case 'GET':
      const criteria: DB.DeckQuery = req.query
      const decks = await listDecks(criteria)
      return res.status(200).json(decks)
    case 'POST':
      const rawData = req.body
      const newDeck = await createDeck(rawData)
      return res.status(201).json(newDeck)
    default:
      return res.status(405).end()
  }
}
