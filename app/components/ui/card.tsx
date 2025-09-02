export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-neutral/80 backdrop-blur-sm rounded-[24px] p-6 border border-neutral-400/20 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${className}`}>
      {children}
    </div>
  );
}
