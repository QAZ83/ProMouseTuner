import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

// For local development without Supabase
export const localAuth = {
  user: null as User | null,
  session: null,
  isLoading: false,
  error: null as string | null,

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: User | null; error: string | null }> {
    // Simulate network request
    localAuth.isLoading = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation
        if (!email || !password) {
          localAuth.error = "Email and password are required";
          localAuth.isLoading = false;
          resolve({ user: null, error: localAuth.error });
          return;
        }

        // Mock credentials check
        if (email === "demo@example.com" && password === "password") {
          const user: User = {
            id: "1",
            email: "demo@example.com",
            username: "Demo User",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
            created_at: new Date().toISOString(),
          };

          localAuth.user = user;
          localAuth.session = { access_token: "mock-token" };
          localAuth.error = null;

          // Save to localStorage
          localStorage.setItem(
            "mousetuner_auth",
            JSON.stringify({
              user,
              session: { access_token: "mock-token" },
            }),
          );

          localAuth.isLoading = false;
          resolve({ user, error: null });
        } else {
          localAuth.error = "Invalid email or password";
          localAuth.isLoading = false;
          resolve({ user: null, error: localAuth.error });
        }
      }, 1000);
    });
  },

  async signUp(
    email: string,
    password: string,
    username: string,
  ): Promise<{ user: User | null; error: string | null }> {
    localAuth.isLoading = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation
        if (!email || !password || !username) {
          localAuth.error = "Email, password, and username are required";
          localAuth.isLoading = false;
          resolve({ user: null, error: localAuth.error });
          return;
        }

        // In a real app, we would check if the email is already in use
        const user: User = {
          id: Date.now().toString(),
          email,
          username,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          created_at: new Date().toISOString(),
        };

        localAuth.user = user;
        localAuth.session = { access_token: "mock-token" };
        localAuth.error = null;

        // Save to localStorage
        localStorage.setItem(
          "mousetuner_auth",
          JSON.stringify({
            user,
            session: { access_token: "mock-token" },
          }),
        );

        localAuth.isLoading = false;
        resolve({ user, error: null });
      }, 1000);
    });
  },

  async signOut(): Promise<{ error: string | null }> {
    localAuth.isLoading = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        localAuth.user = null;
        localAuth.session = null;
        localAuth.error = null;

        // Remove from localStorage
        localStorage.removeItem("mousetuner_auth");

        localAuth.isLoading = false;
        resolve({ error: null });
      }, 500);
    });
  },

  async getCurrentUser(): Promise<User | null> {
    const storedAuth = localStorage.getItem("mousetuner_auth");
    if (storedAuth) {
      try {
        const { user } = JSON.parse(storedAuth);
        localAuth.user = user;
        return user;
      } catch (error) {
        console.error("Error parsing stored auth", error);
      }
    }
    return null;
  },

  async resetPassword(email: string): Promise<{ error: string | null }> {
    localAuth.isLoading = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        if (!email) {
          localAuth.error = "Email is required";
          localAuth.isLoading = false;
          resolve({ error: localAuth.error });
          return;
        }

        // In a real app, we would send a password reset email
        console.log(`Password reset email sent to ${email}`);

        localAuth.isLoading = false;
        resolve({ error: null });
      }, 1000);
    });
  },
};

// Initialize auth state from localStorage
localAuth.getCurrentUser();

// Supabase auth functions
export const auth = {
  async signIn(email: string, password: string) {
    try {
      // Use Supabase if available, otherwise use local auth
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        return { user: data.user as unknown as User, error: null };
      } else {
        return localAuth.signIn(email, password);
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signUp(email: string, password: string, username: string) {
    try {
      // Use Supabase if available, otherwise use local auth
      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              data: {
                username,
              },
            },
          },
        );

        if (authError) {
          // Check if error is related to leaked password
          if (
            authError.message.includes("leaked password") ||
            authError.message.includes("compromised password")
          ) {
            throw new Error(
              "This password has been found in data breaches. Please use a different password for security.",
            );
          }
          throw authError;
        }

        // Create user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user?.id,
              username,
              email,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            },
          ]);

        if (profileError) throw profileError;

        return {
          user: {
            id: authData.user?.id || "",
            email,
            username,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            created_at: new Date().toISOString(),
          },
          error: null,
        };
      } else {
        return localAuth.signUp(email, password, username);
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut() {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        return localAuth.signOut();
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          // Get user profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          return profileData as User;
        }
      } else {
        return localAuth.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.error("Error getting current user", error);
      return null;
    }
  },

  async resetPassword(email: string) {
    try {
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
      } else {
        return localAuth.resetPassword(email);
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
