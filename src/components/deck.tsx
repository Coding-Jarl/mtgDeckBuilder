import styles from './deck.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { removeCard } from '@/lib/redux/slices/deck'
import axios from 'axios'
import { FormEvent, useRef } from 'react'
import { toast } from 'react-toastify'

export default function Deck() {
  const cards = useSelector((state: RootState) => state.deck.cards)
  const deckName = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch()

  const hSave = async (evt: FormEvent) => {
    evt.preventDefault()
    if (!deckName.current) return

    const myData = {
      description: 'totoland',
      name: deckName.current.value || 'Default Deck',
      idAuthor: 1,
      cards: cards,
    }

    await axios
      .post('http://localhost:3000/api/decks', myData)
      .then(() => {
        toast.success('Deck Saved!')
      })
      .catch(() => toast.error('Error, ACHTUNG'))
  }

  return (
    <>
      <ul className={styles.deck}>
        {cards.map((card) => (
          <li key={card.id}>
            <button
              onClick={() =>
                dispatch(
                  removeCard({
                    id: card.id,
                    uuid: card.id,
                    count: 1,
                    name: '',
                  })
                )
              }
            >
              -
            </button>
            {card.count}x {card.name}
          </li>
        ))}
      </ul>
      <form onSubmit={hSave}>
        <input
          type="text"
          name="deckName"
          ref={deckName}
          placeholder="Deck name"
        />
        <input type="submit" value="Save" />
        {/* <button onClick={hSave}>Save</button> */}
      </form>
    </>
  )
}
