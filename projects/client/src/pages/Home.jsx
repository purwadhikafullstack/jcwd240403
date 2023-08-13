import React from "react";

function Home() {
  return (
    <div className="bg-white relative min-h-screen mx-auto">
      {/* header */}
      <div className="h-16 bg-red-500 sticky top-0 max-w-[1366px] mx-auto">Header</div>
      <div className="bg-green-500 h-full flex flex-col">
        <div>asd</div>
      </div>
      <div className="bg-blue-500 h-[200px] absolute bottom-0 left-0 right-0">
        Footer
      </div>
    </div>
  );
}

export default Home;
