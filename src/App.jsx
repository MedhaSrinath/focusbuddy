import { useEffect, useRef, useState } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

function App() {
  const videoRef = useRef(null);
  const [faceStatus, setFaceStatus] = useState("No Face");
  const detectorRef = useRef(null);

  async function setupFaceDetector() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    detectorRef.current = await FaceDetector.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
        },
        runningMode: "VIDEO",
      }
    );
  }

  function detectFace() {
    if (!detectorRef.current || !videoRef.current) return;

    const detections = detectorRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    if (detections.detections.length > 0) {
      setFaceStatus("Face Detected ✅");
    } else {
      setFaceStatus("No Face ❌");
    }
  }

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

    async function initialize() {
      await setupFaceDetector();
      await startCamera();
      
      setInterval(detectFace, 500);
    }

    initialize();
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

      <p>{faceStatus}</p>
    </div>
  );
}

export default App;