import { Settings, TimerResetIcon } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between w-full p-10">
      <div className="flex gap-1">
        <TimerResetIcon size={25} className="text-accent-600" />
        <h1 className="text-xl font-semibold">
          task<span className="text-accent-600 font-extrabold">player</span>
        </h1>
    </div>
      <Settings size={19} className="text-accent-600" />
      {/* todo: dropdown menu for settings */}
    </div>
  );
};

export default Header;
