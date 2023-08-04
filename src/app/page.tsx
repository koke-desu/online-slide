import MainCanvas from "@/components/MainCanvas";
import RightControlPanel from "@/components/RightControlPanel";

const Home = () => {
  return (
    <main className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      <div className="h-12 w-full bg-gray-700"></div>
      <div className="flex-1 w-full">
        <div className="relative h-full w-full">
          <div className="w-60 h-full absolute top-0 left-0 bg-white z-10"></div>
          <MainCanvas />
          <RightControlPanel />
        </div>
      </div>
    </main>
  );
};

export default Home;
