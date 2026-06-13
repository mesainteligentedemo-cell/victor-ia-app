import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <SignIn
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg",
            headerTitle: "text-2xl font-bold text-black dark:text-white",
            headerSubtitle: "text-gray-600 dark:text-gray-400",
            socialButtonsBlockButton: "border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-black dark:text-white",
            formButtonPrimary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 font-semibold",
            footerActionLink: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
            dividerLine: "bg-gray-200 dark:bg-gray-800",
            dividerText: "text-gray-600 dark:text-gray-400",
            formFieldLabel: "text-gray-900 dark:text-gray-100 font-medium",
            formFieldInput: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-black dark:focus:border-white focus:ring-0",
            formFieldLabelRow: "flex items-center justify-between",
            footerActionLinkButton: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
          },
        }}
      />
    </div>
  );
}
