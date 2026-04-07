import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Přihlášení" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">Zajcon Admin</h1>
          <p className="text-sm text-slate">Přihlaste se do administrace</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
