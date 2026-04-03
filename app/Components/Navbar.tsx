"use client";

export default function Navbar({ setView }: { setView: (v: string) => void }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md px-12 py-8 border-b border-[#f5f5f5]">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        
        {/* Vänster: Ändrar vyn till 'home' */}
        <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] text-[#999]">
          <span 
            className="hover:text-black cursor-pointer transition-all" 
            onClick={() => setView("home")}
          >
            Shop
          </span>
        </div>

        {/* Mitten: Loggan ändrar också till 'home' */}
        <div 
          className="text-center text-xl tracking-[0.6em] font-light cursor-pointer"
          onClick={() => setView("home")}
        >
          SWEGBG
        </div>

        {/* Höger: Ändrar vyn till 'contact' */}
        <div className="flex justify-end gap-10 text-[10px] uppercase tracking-[0.3em] text-[#999]">
          <span 
            className="hover:text-black cursor-pointer transition-all" 
            onClick={() => setView("contact")}
          >
            Kontakt
          </span>
        </div>
      </div>
    </nav>
  );
}