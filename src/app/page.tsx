import MainCanvas from "@/components/MainCanvas";

const Home = () => {
  return (
    <main className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      <div className="h-12 w-full bg-gray-700"></div>
      <div className="flex-1 w-full">
        <div className="relative h-full w-full">
          <div className="w-60 h-full absolute top-0 left-0 bg-white z-10"></div>
          <MainCanvas />
          <div className="w-60 h-full absolute top-0 right-0 bg-white z-10"></div>
        </div>
      </div>
    </main>
  );
};

export default Home;
