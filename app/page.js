import CategoryList from "./_components/CategoryList";
import Footer from "./_components/Footer";
import Products from "./_components/Products";
import Slider from "./_components/Slider";
import GlobalApi from "./_utils/GlobalApi";
import Image from "next/image";
export default async function Home() {
  return (
    <>
      <div className="p-1.5 md:p-10  px-3 md:px-16">
        <Slider />
        <CategoryList />

        <Products />

        <Image
          src="/bannerLogo.webp"
          alt="Hero Image"
          width={1200}
          height={100}
          className="relative  md:p-20 w-full h-[100px] md:h-[400px] rounded-2xl mt-10 overflow-hidden"
        />
      </div>
    </>
  );
}
