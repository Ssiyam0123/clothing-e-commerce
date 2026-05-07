export default function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-light border-t-rose-600 rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
          Verifying Transaction
        </p>
      </div>
    </div>
  );
}
