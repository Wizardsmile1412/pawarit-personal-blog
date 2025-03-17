import { useState } from 'react'
import './assets/Global.css'
import {HeroSection, Navbar, Footer} from './components/PageContainer'
import ArticleSection from './components/ArticleSection'

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
