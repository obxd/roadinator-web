import { observer } from "mobx-react-lite";
import { guideStore } from "../../stores/guideStore"; // Import the guide store
import DarkMode from "./darkmode/darkmode";
import WaifuMode from "./waifumode/waifumode";
import Title from "./title/title";

const Header = observer(() => {
  return (
    <div className="flex justify-between items-center px-6 py-8">
      <Title />

      <div className="flex items-center gap-4">
        {/* Guide Button with Beautiful SVG */}
        <button
          onClick={() => guideStore.openGuide()}
          className="w-12 h-12 flex items-center justify-center rounded-full 
                     bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800
                     transition-all shadow-lg"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Circle */}
            <circle cx="12" cy="12" r="10" fill="none" stroke="white" />
            {/* Question Mark */}
            <path d="M12 8c1.5 0 2.5 1 2.5 2.5S13 13 12 13" />
            <circle cx="12" cy="17" r="1" fill="white" />
          </svg>
        </button>

        <WaifuMode />
        <DarkMode />
      </div>
    </div>
  );
});

export default Header;
