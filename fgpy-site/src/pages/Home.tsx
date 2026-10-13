import HeroMosaic from '../sections/HeroMosaic'
import Ticker from '../sections/Ticker'
import Featured from '../sections/Featured'
import Process from '../sections/Process'
import ServicesIndex from '../sections/ServicesIndex'
import Stats from '../sections/Stats'
import Manifesto from '../sections/Manifesto'
import Quote from '../sections/Quote'

export default function Home() {
  return (
    <>
      <HeroMosaic />
      <Ticker />
      <Stats />
      <Featured />
      <Process />
      <ServicesIndex />
      <Manifesto />
      <Quote />
    </>
  )
}
