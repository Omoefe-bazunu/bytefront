import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const useVisitorTracker = (pageName) => {
  useEffect(() => {
    if (!pageName || typeof pageName !== "string") return;

    const safePageName = pageName.replace(/\s+/g, "_").toLowerCase();
    const sessionKey = `visited_${safePageName}`;

    // Exit if already tracked in this browser session
    if (sessionStorage.getItem(sessionKey)) return;

    const trackVisitor = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const geoData = await res.json();

        await addDoc(collection(db, "visitorLog"), {
          page: pageName,
          region: geoData.region || "Unknown",
          country: geoData.country_name || "Unknown",
          city: geoData.city || "Unknown",
          timestamp: serverTimestamp(),
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
          isUnique: true,
        });

        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        console.error("Visitor tracking error:", error);
      }
    };

    trackVisitor();
  }, [pageName]);
};
