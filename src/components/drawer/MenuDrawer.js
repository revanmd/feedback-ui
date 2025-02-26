"use client";

import { useState, useRef, useEffect } from "react";
import { CgChevronUp } from "react-icons/cg";
import { FaArchive } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

export default function MenuDrawer({ event, setEvent }) {
    const [screen, setScreen] = useState("minimize"); // 'minimize', 'half', 'full'

    const handleSurvey = () => {
        setEvent("survey")
        setScreen("minimize")
    }

    const handleHistory = () => {
        setScreen("minimize")
    }

    const MenuComponent = ({
        screen,
        setScreen,
        callbackSurvey,
        callbackHistory
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
            } else if (height < 200) {
                setScreen("minimize");
            }
        };

        useEffect(() => {
            const updateHeight = () => {
                windowHeight.current = window.visualViewport?.height || window.innerHeight;

                if (screen === "full") {
                    setHeight(windowHeight.current);
                }
                if (screen === "half") {
                    currentHeight.current = 200;
                    setHeight(200);
                }
            };

            updateHeight();
        }, [screen]);

        ////////////////////////////////
        const handleClickSurvey = () => {
            callbackSurvey()
        }

        const handleClickHistory = () => {
            callbackHistory()
            currentHeight.current = 0
            setHeight(0)
        }

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

                <div className="text-center mt-3 font-semibold text-xl">Quick Actions</div>
                <div className="text-center mt-3">
                    <div className="inline-block m-3" onClick={handleClickSurvey}>
                        <div style={{backgroundColor:'#0080FB'}} className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg">
                            <FaMapLocationDot
                                className="text-2xl"
                            />
                        </div>
                        <div className="mt-1 text-gray-500">Survey</div>
                    </div>
                    <div className="inline-block m-3" onClick={handleClickHistory}>
                        <div style={{backgroundColor:'#0080FB'}} className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                            <FaArchive
                                 className="text-2xl"
                            />
                        </div>
                        <div className="mt-1 text-gray-500">History</div>
                    </div>
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
                <MenuComponent
                    screen={screen}
                    setScreen={setScreen}
                    callbackSurvey={handleSurvey}
                    callbackHistory={handleHistory}
                />
            )}
            {screen === "minimize" && (
                <div
                    onClick={() => {
                        setScreen("half");
                    }}
                    className="bg-white w-screen py-3.5 px-5 flex items-center shadow-lg"
                >
                    <div className="inline-block">
                        <CgChevronUp
                            className="text-2xl text-gray-500"
                        />
                    </div>
                    <div className="inline-block ml-5 text-gray-500">
                        Tap to see quick actions
                    </div>
                </div>
            )}


        </main>
    );
}
