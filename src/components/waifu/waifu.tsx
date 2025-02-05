import { observer } from "mobx-react-lite";
import { waifuStore } from "../../stores/waifu";
import { useEffect } from "react";

const Waifu = observer(() => {
  useEffect(() => {
    waifuStore.fetchData();
  }, []);

  return (
    <div className="absolute bottom-5 right-5 z-10 w-1/3 max-w-[30%] cursor-pointer ">
      {waifuStore.isWaifuOn && waifuStore.loading && <p>Loading...</p>}
      {waifuStore.isWaifuOn && !waifuStore.loading && (
        <img
          className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-200 active:scale-95 rounded-md"
          src={waifuStore.waifu_url}
          alt="waifu"
          onClick={() => waifuStore.fetchData()}
        />
      )}
    </div>
  );
});

export default Waifu;
