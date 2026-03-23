import { observer } from "mobx-react-lite";
import { mapsStore } from "../../stores/maps";
import { waifuStore } from "../../stores/waifu";
import { darkModeStore } from "../../stores/darkmode";
import type { RoadComponent } from "../../types/road";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "../../utils/debounce";

const Roads = observer(() => {
  const [inputValue, setInputValue] = useState(mapsStore.textField);
  
  const debouncedSetTextField = useCallback(
    debounce((value: string) => {
      mapsStore.setTextField(value);
    }, 200),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetTextField(value);
  };

  return (
    <div
      className={`${
        waifuStore.isWaifuOn ? "w-[65%]" : "w-[95%]"
      } min-h-[70vh] p-4 ml-5 rounded-md shadow-md transition-all duration-300
      bg-pink-300 dark:bg-zinc-900 text-black dark:text-white`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-md bg-white dark:bg-zinc-800 dark:text-white"
        placeholder="Search roads..."
      />

      {!mapsStore.textField && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-lg">Start typing to search for Avalonian Roads</p>
          <p className="text-sm mt-2 opacity-75">Search by road name to see details</p>
        </div>
      )}

      {mapsStore.textField && mapsStore.filteredResults.length === 0 && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-lg">No roads found</p>
          <p className="text-sm mt-2 opacity-75">Try a different search term</p>
        </div>
      )}

      {mapsStore.textField && mapsStore.filteredResults.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Left Column: Search Results */}
          <ul className="p-2 rounded-md bg-pink-400 dark:bg-zinc-700">
            {mapsStore.filteredResults.map((road) => (
              <li
                key={road.name}
                className="p-2 border-b cursor-pointer hover:bg-pink-500 dark:hover:bg-zinc-600"
                onClick={() => mapsStore.selectRoad(road)}
              >
                {highlightText(road.name, road.matches)}
              </li>
            ))}
          </ul>

          {/* Right Column: Selected Road Details */}
          {mapsStore.selectedRoad && (
            <div className="p-4 rounded-md shadow-md bg-pink-200 dark:bg-zinc-800">
              <h2 className="text-xl font-bold">{mapsStore.selectedRoad.name}</h2>
              <p>
                <strong>Road type:</strong> {mapsStore.selectedRoad.data.type}
              </p>

              {/* Responsive Loot Table */}
              {mapsStore.selectedRoad.data.components && (
                <div className="max-w-full overflow-auto">
                  <table className="mt-4 w-full border-collapse border border-black dark:border-gray-500 text-sm">
                    <thead>
                      <tr className="bg-pink-400 dark:bg-zinc-700">
                        <th className="border border-black dark:border-gray-500 p-1 whitespace-nowrap">Type</th>
                        <th className="border border-black dark:border-gray-500 p-1 whitespace-nowrap">Size</th>
                        <th className="border border-black dark:border-gray-500 p-1 whitespace-nowrap">Tier</th>
                        <th className="border border-black dark:border-gray-500 p-1 whitespace-nowrap">Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedComponents(mapsStore.selectedRoad.data.components).map((item, index) => (
                        <tr
                          key={index}
                          className={`border border-black dark:border-gray-500 ${
                            getRowColor(item.bgcolor, item.type)
                          }`}
                        >
                          <td className="border border-black dark:border-gray-500 p-1">{item.type}</td>
                          <td className="border border-black dark:border-gray-500 p-1">{item.size}</td>
                          <td className="border border-black dark:border-gray-500 p-1">{item.tier}</td>
                          <td className="border border-black dark:border-gray-500 p-1">{item.bgcolor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Function to sort components
function getSortedComponents(components: RoadComponent[]) {
  return [...components].sort((a, b) => {
    // Prioritize "mistcity" first
    if (a.type === "mistscity" && b.type !== "mistscity") return -1;
    if (b.type === "mistscity" && a.type !== "mistscity") return 1;
    // Otherwise, sort by type + bgcolor + size
    return (a.type + a.bgcolor + a.size).localeCompare(b.type + b.bgcolor + b.size);
  });
}

// Function to get row colors in light & dark mode
function getRowColor(bgcolor: string, item_type: string) {
  if (item_type === "mistscity")
    return "bg-fuchsia-300 dark:bg-fuchsia-600 text-black dark:text-white"
  switch (bgcolor.toLowerCase()) {
    case "gold":
      return "bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white";
    case "green":
      return "bg-green-300 dark:bg-green-600 text-black dark:text-white";
    case "blue":
      return "bg-blue-300 dark:bg-blue-600 text-black dark:text-white";
    default:
      return "bg-transparent dark:bg-transparent";
  }
}

// Function to highlight matched text in red (light mode) or pink (dark mode)
function highlightText(text: string, matches: number[]) {
  let highlightedText = [];
  let matchSet = new Set(matches);
  for (let i = 0; i < text.length; i++) {
    highlightedText.push(
      matchSet.has(i) ? (
        <span
          key={i}
          className={`font-bold ${
            darkModeStore.isDarkMode ? "text-pink-400" : "text-red-600"
          }`}
        >
          {text[i]}
        </span>
      ) : (
        text[i]
      )
    );
  }
  return highlightedText;
}

export default Roads;
