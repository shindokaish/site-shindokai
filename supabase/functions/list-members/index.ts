// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || '*'

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
      },
    })
  }

  // Vérification token admin
  const adminToken = req.headers.get('x-admin-token')
  const expectedToken = Deno.env.get('ADMIN_SECRET_TOKEN')
  if (!expectedToken || adminToken !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
    })
  }

  // Client admin avec service_role
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Lister tous les utilisateurs (par pages de 1000)
  let allUsers: any[] = []
  let page = 1
  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data?.users?.length) break
    allUsers = allUsers.concat(data.users)
    if (data.users.length < 1000) break
    page++
  }

  const profiles = allUsers.map(u => ({
    id: u.id,
    email: u.email ?? '',
    prenom: u.user_metadata?.prenom ?? '',
    created_at: u.created_at,
    confirmed: !!u.email_confirmed_at,
  }))

  return new Response(JSON.stringify({ users: profiles }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
  })
})
