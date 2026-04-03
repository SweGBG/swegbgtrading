import Link from 'next/link';

export default function KaffeMuggSida() {
  return (
    <main style={{
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      padding: '50px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Tillbaka-knapp */}
      <Link href="/" style={{ marginBottom: '30px', color: '#666', textDecoration: 'none' }}>
        ← Tillbaka till start
      </Link>

      <div style={{
        display: 'flex',
        gap: '40px',
        maxWidth: '1000px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Produktbilden */}
        <img
          src="/product1copy.png"
          alt="DEMO"
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        />

        {/* Produktdetaljer */}
        <div style={{ maxWidth: '400px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>DEMO</h1>
          <p style={{ letterSpacing: '2px', color: '#888', marginBottom: '20px' }}>GÖTEBORG - EST. 2026</p>
          <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
            Vår "Local Roast" är noga utvald för att ge den perfekta koppen kaffe.
            Hela bönor, rostat med kärlek i Göteborg.
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px' }}>
            500g - 149 kr
          </p>

          <button style={{
            marginTop: '30px',
            padding: '15px 30px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            KÖP NU
          </button>
        </div>
      </div>
    </main>
  );
}