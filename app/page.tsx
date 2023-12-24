"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /signup/page.tsx
    router.push("/signup");
  }, []);

  return (
    <div>
      {/* You can add content or a loading message here */}
      Redirecting...
    </div>
  );
};

export default HomePage;
