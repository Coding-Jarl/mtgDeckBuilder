declare global {
  namespace API {
    type Card = {
      multiverseid: string
      name: string
      imageUrl: string
      artist: string // Unreliable
      manaCost: string
      cmc: number
      rarity: string
      power?: string // Creatures
      toughness?: string // Creatures
      loyalty?: string // Planeswalkers
      variations?: string[] // Same cards, different illustrations
    }
    type CardQuery = Partial<{
      multiverseid: string
      name: string
      artist: string // Unreliable
      cmc: number
      rarity: string
      power: string // Creatures
      toughness: string // Creatures
      loyalty: string // Planeswalkers
    }>
  }
}
export {}
