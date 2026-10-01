import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = createClient(supabaseUrl, supabaseServiceKey);

    // Verify token & user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await client.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized user session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { documentVersionId } = await req.json();
    if (!documentVersionId) {
      return new Response(JSON.stringify({ error: "Missing documentVersionId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load user profile
    const { data: profile } = await client
      .from("profiles")
      .select("id, role_key")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load document version & application info
    const { data: version, error: verError } = await client
      .from("document_versions")
      .select("*, document:documents(id, application_id)")
      .eq("id", documentVersionId)
      .single();

    if (verError || !version) {
      return new Response(JSON.stringify({ error: "Document version not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const applicationId = version.document?.application_id;

    // Check application access permission
    let hasAccess = false;
    if (profile.role_key === "admin") {
      hasAccess = true;
    } else if (profile.role_key === "pilot") {
      const { data: app } = await client
        .from("applications")
        .select("pilot_user_id")
        .eq("id", applicationId)
        .single();
      if (app && app.pilot_user_id === profile.id) {
        hasAccess = true;
      }
    } else if (profile.role_key === "verifier") {
      const { data: assign } = await client
        .from("application_assignments")
        .select("id")
        .eq("application_id", applicationId)
        .eq("verifier_user_id", profile.id)
        .eq("active", true)
        .maybeSingle();
      if (assign) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return new Response(JSON.stringify({ error: "Forbidden: No access to preview this document" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate short-lived signed preview URL (60 seconds)
    const { data: signedUrlData, error: signError } = await client.storage
      .from(version.storage_bucket)
      .createSignedUrl(version.storage_path, 60);

    if (signError || !signedUrlData) {
      return new Response(JSON.stringify({ error: "Failed to create preview URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record Audit Event
    await client.from("audit_logs").insert({
      actor_user_id: profile.id,
      actor_role: profile.role_key,
      action: "DOCUMENT_VIEWED",
      entity_type: "document_version",
      entity_id: version.id,
      application_id: applicationId,
      document_id: version.document_id,
      metadata: { file_name: version.original_file_name, expires_in_seconds: 60 }
    });

    return new Response(
      JSON.stringify({
        signedUrl: signedUrlData.signedUrl,
        expiresIn: 60,
        fileName: version.original_file_name,
        mimeType: version.mime_type
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
