"use client";

import { useState, useRef, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import Webcam from "react-webcam";

export default function SurveyDrawer({ event, setEvent }) {
    const [screen, setScreen] = useState("minimize"); // 'minimize', 'half', 'full'\
    const [showMarker, setShowMarker] = useState(true)

    const handleSetMarker = () => {
        setShowMarker(false)
        setScreen('half')
    }

    const handleUnsetMarker = () => {
        setShowMarker(true)
        setScreen("minimize")
    }

    const handleFinish = () => {
        setEvent("view")
        setScreen("minimize")
    }

    const FormComponent = ({
        screen,
        setScreen,
        callbackMinimize,
        callbackFinish
    }) => {
        const startY = useRef(0);
        const currentHeight = useRef(0);
        const windowHeight = useRef(typeof window !== "undefined" && window.visualViewport ? window.visualViewport.height : 800);
        const [height, setHeight] = useState(0);

        const handleTouchStart = (e) => {
            startY.current = e.touches[0].clientY;
            currentHeight.current = height;
        };

        const handleTouchMove = (e) => {
            const moveY = e.touches[0].clientY;
            let newHeight = currentHeight.current + (startY.current - moveY);
            setHeight(newHeight);
        };

        const handleTouchEnd = () => {
            setHeight(height);
            if (height > windowHeight.current) {
                setHeight(windowHeight.current);
                setScreen("full");
            } else if (height > 0.75 * windowHeight.current) {
                setScreen("full");
            } else if (height > 0.5 * windowHeight.current) {
                setScreen("half");
            } else if (height < 300) {
                setScreen("minimize");
                callbackMinimize()
            }
        };

        useEffect(() => {
            const updateHeight = () => {
                windowHeight.current = window.visualViewport?.height || window.innerHeight;
                if (screen === "full") {
                    setHeight(windowHeight.current);
                }
                if (screen === "half") {
                    currentHeight.current = 550;
                    setHeight(550);
                }
            };

            updateHeight();
        }, [screen]);


        ///////////////////////////////////////////////////////////////////
        const videoConstraints = {
            facingMode: "environment"
        };

        const WebcamCapture = () => (
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{
                    maxHeight: "200px",
                    width: "100%", // Ensures it scales properly
                    objectFit: "cover" // Helps maintain aspect ratio
                }}
            >
            </Webcam>
        );


        return (
            <div
                className="bg-white w-screen rounded-t-xl shadow-lg"
                style={{ height: `${height}px` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag handle */}
                <div className="w-full flex justify-center py-2">
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <div className="text-center mt-3 font-semibold">Feedback Form</div>
                <div className="px-10">
                    <div className="mt-3">
                        <label className="text-xs text-gray-600">Komoditas</label>
                        <select className="bg-white border border-gray-200 rounded p-1 mt-1 w-full text-sm">
                            <option>Padi</option>
                            <option>Jagung</option>
                            <option>Tebu</option>
                            <option>Lainnya</option>
                        </select>
                    </div>

                    <div className="mt-3">
                        <label className="text-xs text-gray-600 mb-2">Foto Bukti</label>
                        <WebcamCapture />
                    </div>

                    <button onClick={callbackFinish} className="mt-5 w-full py-2 bg-black text-white rounded-sm">Kirim</button>
                </div>
            </div>
        );
    };

    return (
        <main
            style={{
                position: "absolute",
                zIndex: 1000,
                bottom: 0,
                width: "100%",
            }}
        >

            {screen !== "minimize" && (
                <FormComponent
                    screen={screen}
                    setScreen={setScreen}
                    callbackMinimize={handleUnsetMarker}
                    callbackFinish={handleFinish}
                />
            )}
            {screen === "minimize" && (
                <div
                    onClick={handleSetMarker}
                    className="bg-white w-screen py-3.5 px-5 flex items-center"
                >
                    <div className="inline-block">
                        <FaCheck className="text-lg" />
                    </div>
                    <div className="inline-block ml-5 text-sm text-gray-500">
                        Save current survey location
                    </div>
                </div>
            )}


            {showMarker && (
                <div style={{ zIndex: 1000 }} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">
                    <FaMapMarkerAlt />
                </div>
            )}
        </main>
    );
}
