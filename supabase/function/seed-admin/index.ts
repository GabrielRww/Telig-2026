// @ts-ignore Deno edge runtime import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

Deno.serve(async (req: Request) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const adminEmail = "gabrieelramoswendl4nd@gmail.com";
  const adminPassword = "grw140904";

  // Check if user already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existing = (existingUsers?.users || []).find((u: { email?: string | null }) => u.email === adminEmail);

  if (existing) {
    // Ensure roles exist
    await supabaseAdmin.from("user_roles").upsert([
      { user_id: existing.id, role: "admin" },
      { user_id: existing.id, role: "developer" },
    ], { onConflict: "user_id,role" });

    return new Response(JSON.stringify({ message: "Admin already exists, roles ensured", user_id: existing.id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create user
  const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { full_name: "Gabriel Ramos Wendland" },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Assign roles
  await supabaseAdmin.from("user_roles").insert([
    { user_id: newUser.user.id, role: "admin" },
    { user_id: newUser.user.id, role: "developer" },
  ]);

  return new Response(JSON.stringify({ message: "Admin created successfully", user_id: newUser.user.id }), {
    headers: { "Content-Type": "application/json" },
  });
});
