import { observer } from "mobx-react-lite";
import { darkModeStore } from "../../../stores/darkmode";

const DarkMode = observer(() => {
  return (
    <button
      onClick={() => darkModeStore.toggleDarkMode()}
      className="relative w-14 h-7 flex items-center  bg-zinc-700 dark:bg-pink-300 border-2 border-black rounded-full p-1 transition-all"
    >
      <div
        className={`absolute w-6 h-6 bg-ping-100 rounded-full shadow-md border border-black transform transition-all ${
          darkModeStore.isDarkMode ? "translate-x-5 bg-yellow-400" : "translate-x-0 bg-gray-700"
        }`}
      >
        {darkModeStore.isDarkMode ? "☀️" : "🌙"}
      </div>
    </button>
  );
});

export default DarkMode;
