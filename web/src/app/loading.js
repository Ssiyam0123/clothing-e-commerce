export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-[#050505]">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-light  rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center shadow-2xl animate-bounce">
            <span className="text-primary  font-black italic text-xl">V</span>
          </div>
        </div>
      </div>
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-muted animate-pulse">
        Initializing Vault
      </p>
    </div>
  );
}
