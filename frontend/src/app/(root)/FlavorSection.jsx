import FlavorSlider from "../../components/FlavorSlider";
import FlavorTitle from "../../components/FlavorTitle";

export default function FlavorSection() {
  return (
    <section className="flavor-section relative w-full min-h-screen bg-[#E7F0E4] text-[#2F5D34] overflow-hidden flex flex-col justify-center">
      <div className="w-full h-full flex flex-col lg:flex-row items-center relative py-12 lg:py-0">
        <div className="w-full lg:w-[40%] flex-none px-6 lg:px-12 flex justify-center items-center z-20 mb-8 lg:mb-0">
          <FlavorTitle />
        </div>
        <div className="w-full lg:w-[60%] h-full flex-1 overflow-hidden z-10">
          <FlavorSlider />
        </div>
      </div>
    </section>
  );
}
