import Header from "../components/Layout/Header";
import Hero from "../components/Routes/Hero";
import Categories from "../components/Routes/Categories";
import BestDeals from "../components/Routes/BestDeals";
import FeaturedProduct from "../components/Routes/FeaturedProduct";
import Footer from "../components/Layout/Footer";

const Home = () => {
  return (
    <>
        <Header activeHeading={1} />
        <Hero />
        <Categories />
        <BestDeals />
        <FeaturedProduct />
        <Footer />
    </>
  )
}

export default Home