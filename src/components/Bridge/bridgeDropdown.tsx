import Images from "@/public/Assets/Images";
import { useIsDarkMode } from "@/state/user/hooks";
import Image from "next/image";

export const BridgeDisplay = ({ targetName, photo, label }) => {
  const isDarkMode = useIsDarkMode();

  return (
    <>
      <div className="w-full relative rounded-xl px-3 py-3 bg-gradient-radial8">
        <div className="w-full flex items-center gap-5">
          <div className="rounded-full w-14 h-14 p-3 bg-gradient-radial7">
            <Image src={photo || Images.arbitrum} />
          </div>
          <div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white opacity-60" : "text-specialGray"
              } font-medium`}
            >
              {label}
            </p>
            <p
              className={`text-lg ${
                isDarkMode ? "text-white" : "text-specialGray"
              } font-extrabold`}
            >
              {targetName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
