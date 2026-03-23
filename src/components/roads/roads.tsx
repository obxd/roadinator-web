  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (mapsStore.filteredResults.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => 
        prev < mapsStore.filteredResults.length - 1 ? prev + 1 : prev
46:       }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const selectedRoad = mapsStore.filteredResults[selectedIndex]
      if (selectedRoad) {
        mapsStore.selectRoad(selectedRoad);
      }
    }
  }, [mapsStore.filteredResults, selectedIndex])

  useEffect(() => {
    if (mapsStore.filteredResults.length > 0 && mapsStore.selectedRoad) {
      const idx = mapsStore.filteredResults.findIndex(
        (r) => r.name === mapsStore.selectedRoad?.name
      )
      if (idx !== -1) setSelectedIndex(idx)
    }
  }, [mapsStore.selectedRoad, mapsStore.filteredResults])

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const roadName = decodeURIComponent(hash.slice(1));
      if (roadName) {
        setInputValue(roadName);
        setSelectedIndex(0);
        debouncedSetTextField(roadName);
      }
    }
  }, [mapsStore.textField, mapsStore.selectedRoad]);

  return (
    <div
      className={`${
        waifuStore.isWaifuOn ? "lg:w-[65%] w-full" : "w-full lg:w-[95%]"
      } else {
        "w-full lg:w-[95%]"
      } min-h-[70vh] p-2 md:p-4 lg:ml-5 rounded-md shadow-md transition-all duration-300
      bg-pink-300 dark:bg-zinc-900 text-black dark:text-white`}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border rounded-md bg-white dark:bg-zinc-800 dark:text-white"
        placeholder="Search roads..."
      />

      <div className="flex flex-wrap gap-2 mt-2">
        <select
          value={mapsStore.selectedType}
          onChange={(e) => mapsStore.setTypeFilter(e.target.value)}
          className="px-2 py-1 text-sm rounded bg-white dark:bg-zinc-800 dark:text-white border"
        >
          <option value="">All Types</option>
          {mapsStore.roadTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={mapsStore.selectedTier}
          onChange={(e) => mapsStore.setTierFilter(e.target.value)}
          className="px-2 py-1 text-sm rounded bg-white dark:bg-zinc-800 dark:text-white border"
        >
          <option value="">All Tiers</option>
          {mapsStore.roadTiers.map((tier) => (
            <option key={tier} value={tier}>Tier {tier}</option>
          ))}
        </select>
      </div>

      {!mapsStore.textField && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-lg">Start typing to search for Avalonian Roads</p>
          <p className="text-sm mt-2 opacity-75">Search by road name to see details</p>
          {mapsStore.recentSearches.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-bold mb-2">Recent searches</h3>
              <div className="flex flex-wrap gap-1">
                {mapsStore.recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setInputValue(term);
                      setSelectedIndex(0);
                      debouncedSetTextField(term);
                    }}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-pink-300 dark:hover:bg-zinc-500 rounded"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                onClick={() => mapsStore.clearRecentSearches()}
                className="px-2 py-1 text-xs text-gray-500 mt-2"
              >
                Clear
              </button>
            </div>
          )}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Left Column: Search Results */}
          <ul className="p-2 rounded-md bg-pink-400 dark:bg-zinc-700">
            {mapsStore.filteredResults.map((road, index) => (
              <li
                key={road.name}
                className={`p-2 border-b cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? "bg-pink-600 dark:bg-zinc-500"
                    : "hover:bg-pink-500 dark:hover:bg-zinc-600"
                }`}
                onClick={() => {
                  setSelectedIndex(index);
                  mapsStore.selectRoad(road);
                }}
              >
                {highlightText(road.name, road.matches)}
              </li>
            ))}
          </ul>

          {/* Right Column: Selected Road Details */}
          {mapsStore.selectedRoad && (
            <div className="p-4 rounded-md shadow-md bg-pink-200 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{mapsStore.selectedRoad.name}</h2>
                <button
                  onClick={() => handleCopyName(mapsStore.selectedRoad!.name)}
                  className="px-2 py-1 text-xs rounded bg-pink-400 dark:bg-zinc-600 
                           hover:bg-pink-500 dark:hover:bg-zinc-500 transition-colors"
                  title="Copy road name"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
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
}
