import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { API } from "@/lib/studentApi";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!token) {
      setMessage("Invalid or missing password setup link.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setMessage("Password must be between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/student-auth/set-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not set password.");
      }

      setSuccess(true);
      setMessage(
        data.message || "Password set successfully. Your account is activated."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold tracking-tight">Set Your Password</h1>

        <p className="text-sm text-gray-600">
          Create a password for your SS Infotech student account.
        </p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          disabled={loading || success}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          disabled={loading || success}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
        />

        {message && (
          <p
            role="status"
            className={`text-sm ${
              success ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading
            ? "Setting password..."
            : success
              ? "Password Set"
              : "Set Password"}
        </button>

        {success && (
          <Link
            to="/login"
            state={{ from: "/student-dashboard" }}
            className="block text-center text-sm font-semibold text-primary hover:underline"
          >
            Continue to login
          </Link>
        )}
      </form>
    </div>
  );
};

export default SetPassword;
