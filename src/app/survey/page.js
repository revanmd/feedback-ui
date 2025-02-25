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
    return (
        <main>

            <Map
                event={event}
            />

            {event !== "survey" && <MenuDrawer event={event} setEvent={setEvent}/>}
            {event === "survey" && <SurveyDrawer event={event} setEvent={setEvent}/>}
            
        </main>
    )
}