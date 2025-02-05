import { observer } from "mobx-react-lite";
import { waifuStore } from "../../../stores/waifu";
import waifuSVG from "../../../assets/waifu.svg";
import noSVG from "../../../assets/no.svg";

const WaifuMode = observer(() => {
  return (
    <button
      onClick={() => waifuStore.toggleWaifuMode()}
    >
      <div className="relative w-12 h-12 flex items-center justify-center">

        <div className="absolute w-10 h-10 bg-white rounded-full shadow-md"></div>

        {/* Smaller Waifu Image (Centered) */}
        <img src={waifuSVG} alt="waifu" className="w-8 h-8 relative z-10 object-contain" />

        {/* Red No Overlay (Only Visible When `isWaifuOn` is true) */}
        {waifuStore.isWaifuOn && (
          <img
            src={noSVG}
            alt="no waifu"
            className="absolute top-0 left-0 w-full h-full object-contain z-20"
          />
        )}
      </div>
    </button>
  );
});

export default WaifuMode;
