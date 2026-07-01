import { createClient } from "./lib/supabase/server-client";
import LoginPage from "./Auth/login/page";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  return !user ? (
    <LoginPage />
  ) : (
    <div>
      <p style={{ color: "green" }}>Logged in as: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  );
}

// <div style={{ padding: "2rem", fontFamily: "monospace" }}>
//   <h1>Supabase Connection Test</h1>
//   {error && error.message !== "Auth session missing!" ? (
//     <p style={{ color: "red" }}>Connection error: {error.message}</p>
//   ) : (
//     <p style={{ color: "green" }}>Supabase connected successfully</p>
//   )}

//   <h2>Auth Status</h2>
//   {user ? (
//     <div>
//       <p style={{ color: "green" }}>Logged in as: {user.email}</p>
//       <p>User ID: {user.id}</p>
//     </div>
//   ) : (
//     <p style={{ color: "orange" }}>Not logged in (no active session)</p>
//   )}
// </div>