"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/lib/auth-client";
import { Eye, EyeOff, Briefcase, Users } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    companyName: "",
    role: "EMPLOYER" as "EMPLOYER" | "CANDIDATE",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "candidate" || roleParam === "employer") {
      setFormData((prev) => ({
        ...prev,
        role: roleParam.toUpperCase() as "EMPLOYER" | "CANDIDATE",
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (formData.role === "EMPLOYER" && !formData.companyName.trim()) {
      setError("Company name is required for employers");
      setIsLoading(false);
      return;
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        companyName:
          formData.role === "EMPLOYER" ? formData.companyName : undefined,
        role: formData.role,
      });

      setSuccess("Account created successfully! Please sign in.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: "EMPLOYER" | "CANDIDATE") => {
    setFormData((prev) => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="text-xl font-semibold text-black">
              HireScore
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">
              Create your account
            </h1>
            <p className="text-gray-600">Get started with HireScore today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-black">I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("EMPLOYER")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-colors text-sm font-medium ${
                    formData.role === "EMPLOYER"
                      ? "border-black bg-gray-50 text-black"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  Employer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("CANDIDATE")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-colors text-sm font-medium ${
                    formData.role === "CANDIDATE"
                      ? "border-black bg-gray-50 text-black"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Candidate
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-black">
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={isLoading}
                className="h-10 border-gray-200 focus:border-black focus:ring-0"
              />
            </div>

            {formData.role === "EMPLOYER" && (
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-medium text-black"
                >
                  Company name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  disabled={isLoading}
                  className="h-10 border-gray-200 focus:border-black focus:ring-0"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={isLoading}
                className="h-10 border-gray-200 focus:border-black focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-black"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password (min. 6 characters)"
                  disabled={isLoading}
                  className="h-10 border-gray-200 focus:border-black focus:ring-0 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-black"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className="h-10 border-gray-200 focus:border-black focus:ring-0 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-black text-white hover:bg-gray-800 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-black hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
