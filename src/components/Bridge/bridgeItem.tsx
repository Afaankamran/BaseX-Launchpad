import { useIsDarkMode } from "@/state/user/hooks";
import { BridgeDisplay } from "./bridgeDropdown";

export default function BridgeItem({
  targetName,
  value,
  updateData,
  photo,
  label,
}) {
  const isDarkMode = useIsDarkMode();

  const handleChange = (e: any) => {
    let value = e.target.value;
    if (value > 1000000) return;
    if (value < 0) return;
    if (isNaN(value)) return;

    updateData({
      targetName,
      value,
      photo,
    });
  };

  return (
    <>
      <div
        className={`${
          isDarkMode ? "bg-gradient-radial9" : "bg-backgroundGray"
        } p-2 rounded-xl flex items-center md:flex-row flex-col md:pb-2 pb-3 gap-3`}
      >
        <div className="md:w-9/20 w-full flex items-center gap-3 ">
          <BridgeDisplay label={label} targetName={targetName} photo={photo} />
          <div className="hidden md:block w-px h-9 bg-gradient-radial7 "></div>
        </div>
        <input
          onChange={handleChange}
          type="number"
          pattern="[0-9]+"
          value={value}
          min="0"
          step="0.1"
          placeholder="0.0"
          max="100000"
          className={` md:w-11/20 w-full appearance-none bg-transparent ${
            isDarkMode ? "text-lightBlue" : "text-specialGray"
          } text-lg font-extrabold`}
        />
      </div>
    </>
  );
}
