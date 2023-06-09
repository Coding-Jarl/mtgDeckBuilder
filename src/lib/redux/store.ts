import { configureStore } from '@reduxjs/toolkit'
import deckReducer from './slices/deck'

export const store = configureStore({
  reducer: {
    deck: deckReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
