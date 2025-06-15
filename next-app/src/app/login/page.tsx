"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "../../components/AuthModal";

function LoginPageContent() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <>
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          if (redirect) {
            router.push(redirect);
          } else {
            router.push("/dashboard");
          }
        }}
      />
      {!isOpen && (
        <div className="text-center mt-10 text-white/80">
          Please sign in to continue.<br />
          <button
            className="auth-modal-btn mt-4"
            onClick={() => setIsOpen(true)}
          >
            Open Sign In Modal
          </button>
        </div>
      )}
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