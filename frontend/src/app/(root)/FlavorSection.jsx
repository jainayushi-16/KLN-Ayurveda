import FlavorSlider from "../../components/FlavorSlider";
import FlavorTitle from "../../components/FlavorTitle";
export default function FlavorSection() {
    return (<div className="flavor-section bg-[#E7F0E4] mb-10 md:mb-0">
      <div className="h-full flex lg:flex-row flex-col items-center relative">
        <div className="lg:w-[57%] flex-none h-80 lg:h-full md:mt-20 xl:mt-0">
          <FlavorTitle />
        </div>
        <div className="h-full">
          <FlavorSlider />
        </div>
      </div>
    </div>);
}
