import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Get request body - handle both JSON and form data
    let priceId, planType;
    
    try {
      const contentType = req.headers.get("content-type") || "";
      logStep("Content type", { contentType });
      
      if (contentType.includes("application/json")) {
        const body = await req.json();
        logStep("JSON body received", body);
        priceId = body.priceId;
        planType = body.planType;
      } else {
        const formData = await req.formData();
        logStep("Form data received", Object.fromEntries(formData));
        priceId = formData.get("priceId");
        planType = formData.get("planType");
      }
    } catch (parseError) {
      logStep("Parse error, using URL params", { error: parseError.message });
      const url = new URL(req.url);
      priceId = url.searchParams.get("priceId");
      planType = url.searchParams.get("planType");
    }

    if (!priceId) throw new Error("Price ID is required");
    logStep("Final request data", { priceId, planType });

    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth header (optional for guest checkout)
    let userEmail = "guest@example.com";
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        if (userData.user?.email) {
          userEmail = userData.user.email;
          logStep("User authenticated", { email: userEmail });
        }
      } catch (error) {
        logStep("Auth optional, proceeding with guest checkout");
      }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Determine if this is a subscription or one-time payment
    const isSubscription = planType === "monthly" || planType === "annual";
    const mode = isSubscription ? "subscription" : "payment";
    logStep("Payment mode determined", { mode, planType });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancelled`,
      allow_promotion_codes: true,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});