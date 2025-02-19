import { observer } from "mobx-react-lite";
import { useEffect, useCallback } from "react";
import { guideStore } from "../../stores/guideStore";
import guideImage from "../../assets/guide.png";

const GuidePane = observer(() => {
  // Ensure ESC key only works when the guide is open
  const handleEsc = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && guideStore.isOpen) {
      guideStore.closeGuide();
    }
  }, []);

  useEffect(() => {
    // Only attach listener if guide is open
    if (guideStore.isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [guideStore.isOpen]); // Reacts only to `isOpen` changes

  if (!guideStore.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white dark:bg-zinc-900 p-4 rounded-md shadow-lg max-w-3xl w-full">
        {/* Close Button (More Visible) */}
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center 
                     text-white bg-red-500 hover:bg-red-600 
                     dark:bg-red-700 dark:hover:bg-red-800 
                     rounded-full shadow-md transition-all"
          onClick={() => guideStore.closeGuide()}
          aria-label="Close guide"
        >
          ✖
        </button>

        {/* Guide Image */}
        <div className="flex justify-center">
          <img src={guideImage} alt="Guide" className="max-w-full max-h-[80vh] rounded-md" />
        </div>
      </div>
    </div>
  );
});

export default GuidePane;
