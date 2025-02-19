import Header from "./components/header/header";
import Waifu from "./components/waifu/waifu";
import Roads from "./components/roads/roads";
import GuidePane from "./components/guidepane/guidepane";

function App() {
  return (
    <>
      <div className='flex flex-col min-h-screen bg-pink-200 dark:bg-zinc-800'>
        <Header />
        <Waifu />
        <Roads />
        <GuidePane /> 
      </div>
    </>
  );
}

export default App;
