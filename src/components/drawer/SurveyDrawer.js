"use client";

import { useState, useRef, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import Webcam from "react-webcam";

export default function SurveyDrawer({ 
    event, 
    setEvent,
    screen,
    setScreen
}) {
    const [showMarker, setShowMarker] = useState(true)

    const handleSetMarker = () => {
        setShowMarker(false)
        setScreen('half')
    }

    const handleUnsetMarker = () => {
        setShowMarker(true)
        setScreen("minimize")
    }

    const handleCancel = () => {
        setEvent("view")
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
                    maxHeight: "220px",
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

                <div className="text-center mt-3 font-semibold">Survey Komoditas</div>
                <div className="px-10">
                    <div className="mt-3">
                        <label className="text-xs text-gray-600">Komoditas<span className="text-red-400">*</span></label>
                        <select className="bg-white border border-gray-200 rounded p-1 mt-1 w-full"
                            defaultValue={null}
                        >
                            <option value="" disabled selected>Pilih komoditas</option>
                            <option>Padi</option>
                            <option>Jagung</option>
                            <option>Tebu</option>
                            <option>Lainnya</option>
                        </select>
                    </div>

                    <div className="mt-3">
                        <label className="text-xs text-gray-600">Hari Setelah Tanam</label>
                        <input type="number" className="bg-white border border-gray-200 rounded p-1 mt-1 w-full"></input>
                    </div>


                    <div className="mt-3">
                        <label className="text-xs text-gray-600 mb-2">Foto Bukti<span className="text-red-400">*</span></label>
                        <WebcamCapture />
                    </div>

                    <button 
                        onClick={callbackFinish} 
                        className="mt-5 w-full py-2 text-white rounded font-semibold"
                        style={{backgroundColor:'#166832', color:'white'}}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        );
    };

    return (
        <main
            style={{ position: "absolute", zIndex: 1000, bottom: 0, width: "100%" }}
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
                <div className="bg-white w-screen py-3.5 px-5 flex items-center">
                    <div className="inline-block ml-3 text-sm text-gray-500">
                        Apakah posisi ini sudah sesuai ?
                    </div>
                </div>
            )}



            {showMarker && (
                <div>
                    <div style={{ zIndex: 1000 }} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
                        <FaMapMarkerAlt
                            color="white"
                        />
                    </div>

                    <div style={{ zIndex: 1000, position: 'absolute', bottom: 130, right: 10 }}>
                        <div onClick={handleCancel} className="bg-white rounded-full p-5 shadow-md text-red-600" >
                            <IoCloseOutline 
                                className="text-2xl"
                            />
                        </div>
                    </div>

                    <div 
                        style={{ zIndex: 1000, position: 'absolute', right: 10 }} 
                        className="bottom-14 mb-1"
                    >
                        <div onClick={handleSetMarker} className="bg-white rounded-full p-5 shadow-md" >
                            <FaCheck
                                className="text-2xl"
                                color="#166832"
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
