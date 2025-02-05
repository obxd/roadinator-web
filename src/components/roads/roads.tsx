import { observer } from "mobx-react-lite";
import { mapsStore } from "../../stores/maps";

const Roads = observer(() => {
  return (
    <>
      <input
        type="text"
        value={mapsStore.textField}
        onChange={(e) => mapsStore.setTextField(e.target.value)}
        className="mt-4 ml-4 gap-4 w-[42%] p-2 border rounded-md"
        placeholder="Type something xD"
      />
      <div className=" grid grid-cols-2 gap-4 min-w-[30%] min-h-[70%] w-[65%] h-auto border border-white/5 rounded-md shadow-black mt-4 ml-4 p-4">
        <div className="col-span-1">
          {/* <Selector /> */}
          foo
        </div>
        <div className="col-span-1">
          {/* <InfoDisplay /> */}
          goo
        </div>
      </div>
    </>
  );
});

export default Roads;
