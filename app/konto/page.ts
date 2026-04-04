"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function KontoPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/medlem");
      else setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <main className= "medlem-page" >
    <div className="medlem-card" style = {{ padding: '2rem' }
}>
  <h1 style={ { fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '1rem' } }>
    Mitt konto
      </h1>
      < p style = {{ color: '#666', marginBottom: '2rem' }}> { user.email } </p>
        < button className = "medlem-submit" onClick = { handleLogout } >
          Logga ut
            </button>
            </div>
            </main>
  );
}