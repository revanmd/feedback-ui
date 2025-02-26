"use client"


import { MenuDrawer, SurveyDrawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import { useState } from "react";


// Dynamic Import Component
const Map = dynamic(() => import("@/components/map"), {
    ssr: false,
});

export default function PageSurvey() {
    // form-filling, detail, tagging
    const [event, setEvent] = useState('view')
    const [screen, setScreen] = useState('minimize')

    const callbackPressMap = () => {
        setEvent('survey')
    }

    return (
        <main>

            <Map
                event={event}
                screen={screen}
                callbackPressMap={callbackPressMap}
            />

            {event !== "survey" && (
                <MenuDrawer 
                    event={event} 
                    setEvent={setEvent} 
                    screen={screen}
                    setScreen={setScreen}
                />
            )}

            {event === "survey" && (
                <SurveyDrawer 
                    event={event} 
                    setEvent={setEvent} 
                    screen={screen}
                    setScreen={setScreen}
                />
            )}

        </main>
    )
}