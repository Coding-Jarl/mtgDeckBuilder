import Head from 'next/head'
import Layout from '@/components/layout'
import Gallery from '@/components/gallery'
import Card from '@/components/card'
import { store } from '@/lib/redux/store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { ChangeEvent, useState, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'
import useOnScreen from '@/lib/hooks/useOnScreen'

const siteTitle = 'MtgDeckBuilder - Home'

interface CardData {
  id: string
  name: string
  imageUrl: string
}

export default function Home() {
  const [needle, setNeedle] = useState('')
  const bumperRef = useRef()
  const isBumperVisible = useOnScreen(bumperRef)

  const getKey = (pageIndex: number, previousPageData: Array<CardData>) => {
    if (previousPageData && !previousPageData.length) return null
    return `https://api.magicthegathering.io/v1/cards?name=${needle}&page=${
      pageIndex + 1
    }`
  }
  const fetcher = (url: string) =>
    fetch(url)
      .then((r) => r.json())
      .then((data) => data.cards.filter((card: CardData) => card.imageUrl))

  // data: pages of data from the API
  // size: number of pages that should be loaded
  // setSize: setter for "size": +1 => load one more page
  // getKey: function to get the unique URL for a page
  // fetcher: function to fetch (sic) data itself
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

  const hChangeNeedle = (evt: ChangeEvent<HTMLInputElement>) => {
    setNeedle(evt.currentTarget.value)
  }

  return (
    <Provider store={store}>
      <Layout>
        <Head>
          <title>{siteTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <input type="search" value={needle} onChange={hChangeNeedle} />
        <Gallery>
          {!data
            ? 'Please wait, loading...'
            : data.map((page) => {
                return page.map((card: CardData) => (
                  <Card
                    name={card.name}
                    id={card.id}
                    imgUrl={card.imageUrl}
                    key={card.id}
                  />
                ))
              })}
        </Gallery>
        <div ref={bumperRef}>
          {isBumperVisible && (
            <button onClick={() => setSize(size + 1)}>Load More</button>
          )}
        </div>
      </Layout>
      <ToastContainer />
    </Provider>
  )
}
