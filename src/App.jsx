import { useEffect, useRef } from "react";

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    }

    startCamera();
  }, []);

  return (
    <div>
      <h1>FocusBuddy</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="600"
      />

      <p>Camera Active</p>
    </div>
  );
}

export default App;