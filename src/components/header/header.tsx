import { observer } from "mobx-react-lite";
import DarkMode from "./darkmode/darkmode";
import WaifuMode from "./waifumode/waifumode";
import Title from "./title/title";

const Header = observer(() => {
  return (
    <div className="flex justify-between items-center  px-6 py-8">
      <Title />

      <div className="flex items-center">
        <WaifuMode />
        <DarkMode />
      </div>
    </div>
  );
});

export default Header;
