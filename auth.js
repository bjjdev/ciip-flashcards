const { createClient } = supabase;
const _sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const Auth = {
  async getSession() {
    const { data: { session } } = await _sb.auth.getSession();
    return session;
  },

  async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      window.location.href = "login.html";
      return null;
    }
    return session;
  },

  async signUp(email, password) {
    const { data, error } = await _sb.auth.signUp({ email, password });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await _sb.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signOut() {
    await _sb.auth.signOut();
    window.location.href = "login.html";
  },

  async resetPassword(email) {
    const { error } = await _sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/index.html"
    });
    return { error };
  },

  async getSubscription() {
    const session = await this.getSession();
    if (!session) return null;
    const { data } = await _sb
      .from('subscriptions')
      .select('status, stripe_customer_id, current_period_end')
      .eq('user_id', session.user.id)
      .single();
    return data;
  },

  async requireSubscription() {
    const session = await this.requireAuth();
    if (!session) return null;
    const sub = await this.getSubscription();
    const active = sub && (sub.status === 'active' || sub.status === 'trialing');
    if (!active) {
      window.location.href = 'upgrade.html';
      return null;
    }
    return session;
  }
};
