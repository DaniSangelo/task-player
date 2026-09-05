import { ClockLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="justify-center items-center flex min-h-screen">
      <ClockLoader speedMultiplier={2} />
    </div>
  );
};

export default Loading;
