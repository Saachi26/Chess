import { useNavigate } from "react-router-dom";
export const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex justify-center">
            <img src="/assets/chess bg.png" width={400} height={300} />
          </div>
          <div className="pt-16">
            <div className="flex justify-center">
              <h1 className="text-4xl font-bold text-white">
                Play chess online Site!
              </h1>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                className="rounded-2xl"
                onClick={() => {
                  navigate("/game");
                }}
              >
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
