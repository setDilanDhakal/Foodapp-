import HeroSlide from "../Components/home/HeroSlide.jsx";
import NepaliCuisine from "../Components/home/nepalicuisine.jsx";
import IndianCuisine from "../Components/home/indiancuisine.jsx";
import FindYourFlavor from "../Components/home/FindYourFlavor.jsx";
import DeliveryAndRating from "../Components/home/DeliveryAndRating.jsx";
import TheCrowdFav from "../Components/home/TheCrowdFav.jsx";
import FromKitchenToTable from "../Components/home/FromKitchenToTable.jsx";
import KindWords from "../Components/home/KindWords.jsx";
import WhyBhojExpress from "../Components/home/WhyBhojExpress.jsx";
import Members from "./Members.jsx";
import ReadyForApetite from "../Components/home/ReadyForApetite.jsx";

function Home() {

  return (
    <div className="overflow-hidden bg-orange-50 text-orange-950">

      <HeroSlide />

      <FindYourFlavor />

      <IndianCuisine category={"Indian Cuisine"} />

      <TheCrowdFav />

      <NepaliCuisine category={"Nepali Cuisine"} />

      <IndianCuisine category={"Snacks"} />

      <DeliveryAndRating />

      <FromKitchenToTable />

      <KindWords />

      <WhyBhojExpress />

      <Members />

      <ReadyForApetite />

    </div>
  );
}

export default Home;