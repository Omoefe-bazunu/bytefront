import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// Retrieves recent visitor logs
export const getVisitorStats = async () => {
  const q = query(
    collection(db, "visitorLog"),
    orderBy("timestamp", "desc"),
    limit(100)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // Format timestamp for dashboard readability
    timestamp: doc.data().timestamp?.toDate().toLocaleString() || "N/A",
  }));
};

// Calculates total hits and unique session counts
export const getQuickMetrics = async () => {
  const snapshot = await getDocs(collection(db, "visitorLog"));
  const logs = snapshot.docs.map((doc) => doc.data());

  return {
    total: logs.length,
    unique: logs.filter((log) => log.isUnique).length,
  };
};
