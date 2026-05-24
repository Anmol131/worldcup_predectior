function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-200" />
    </div>
  );
}

export default LoadingSpinner;