"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "../../components/AuthModal";

function LoginPageContent() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleClose = () => {
    setIsOpen(false);
    // Redirect to dashboard when modal is closed without signing in
    router.push("/dashboard");
  };

  return (
    <>
      <AuthModal
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={() => {
          if (redirect) {
            router.push(redirect);
          } else {
            router.push("/dashboard");
          }
        }}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
} 