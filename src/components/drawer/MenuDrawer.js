"use client";

import { useState, useRef, useEffect } from "react";
import { CgChevronUp } from "react-icons/cg";

export default function MenuDrawer({ event, setEvent }) {
    const [screen, setScreen] = useState("minimize"); // 'minimize', 'half', 'full'

    const handleSurvey = () => {
        setEvent("survey")
        setScreen("minimize")
    }

    const handleHistory =  () => {
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
        const handleClickSurvey = () =>{
            callbackSurvey()
        }

        const handleClickHistory = () =>{
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

                <div className="text-center mt-3 font-semibold">Quick Actions</div>
                <div className="text-center mt-3">
                    <div className="inline-block m-3" onClick={handleClickSurvey}>
                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                            S
                        </div>
                        <div className="mt-1 text-sm text-gray-500">Survey</div>
                    </div>
                    <div className="inline-block m-3" onClick={handleClickHistory}>
                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                            H
                        </div>
                        <div className="mt-1 text-sm text-gray-500">History</div>
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
                        <CgChevronUp className="text-lg" />
                    </div>
                    <div className="inline-block ml-5 text-sm text-gray-500">
                        Tap to see quick actions
                    </div>
                </div>
            )}

            
        </main>
    );
}
