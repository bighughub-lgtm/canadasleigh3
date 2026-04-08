import TrustStrip from '../components/TrustStrip'
import UseCases from '../components/UseCases'
import Benefits from '../components/Benefits'
import ProductOverview from '../components/ProductOverview'
import ApvidusFeature from '../components/ApvidusFeature'
import ProductCatalog from '../components/ProductCatalog'
import Gallery from '../components/Gallery'
import VideoSection from '../components/VideoSection'
import OrderSteps from '../components/OrderSteps'
import DeliveryPayment from '../components/DeliveryPayment'
import About from '../components/About'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Hero from '../components/Hero'

export default function MainPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <UseCases />
      <Benefits />
      <ProductOverview />
      <ApvidusFeature />
      <ProductCatalog />
      <Gallery />
      <VideoSection />
      <OrderSteps />
      <DeliveryPayment />
      <About />
      <FAQ />
      <Contact />
    </>
  )
}
