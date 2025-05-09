// pages/interview.js
"use client";

import { useState, useEffect, useRef } from "react";

export default function RecordRes() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // Setup camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera(); // Ensure camera is off when component unmounts
    };
  }, []);

  // Setup speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setFinalTranscript((prev) => prev + transcriptPiece + " ");
          } else {
            interimTranscript += transcriptPiece;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setTranscript(finalTranscript);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech recognition not supported in this browser");
    }
  }, [finalTranscript]);

  const handleToggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setTranscript("");
      setFinalTranscript("");
      startCamera(); // Start camera when recording begins
      recognitionRef.current?.start();
    } else {
      // Stop recording
      recognitionRef.current?.stop();
      stopCamera(); // Stop camera when recording stops
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="max-w-2xl mx-auto p-5 text-center">
      <h1 className="text-2xl font-bold mb-5">Interview Recorder</h1>
      <div className="my-5">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full max-w-[600px] h-auto rounded-lg bg-black mx-auto"
        />
      </div>
      <button
        onClick={handleToggleRecording}
        className="px-5 py-2.5 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <div className="mt-5 text-left">
        <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
        {isRecording ? (
          <p className="text-gray-600 min-h-[100px]">
            Recording your response...
          </p>
        ) : (
          <p className="text-black min-h-[100px] p-2.5 bg-gray-100 rounded-md">
            {finalTranscript}
          </p>
        )}
      </div>
    </div>
  );
}
