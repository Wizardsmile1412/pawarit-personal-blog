import { useState } from 'react'
import './assets/Global.css'
import {HeroSection, Navbar, ArticleSection, Footer} from './components/PageContainer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <HeroSection/>
    <ArticleSection/>
    <Footer/>
    </>
  )
}

export default App
