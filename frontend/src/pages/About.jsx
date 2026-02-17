 export default function About() {
  return (
    <>
      <section className="py-20 px-8 bg-slate-100 text-center mb-4">
        <h2 className="text-3xl font-bold mb-12">
          Why Collab-Genius?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow">
            🤝
            <h3 className="font-bold mt-3">Find Teammates</h3>
            <p className="text-sm text-slate-500 mt-2">
              Connect with like-minded builders.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            🚀
            <h3 className="font-bold mt-3">Launch Faster</h3>
            <p className="text-sm text-slate-500 mt-2">
              Turn ideas into real products.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            🌍
            <h3 className="font-bold mt-3">Global Network</h3>
            <p className="text-sm text-slate-500 mt-2">
              Collaborate worldwide.
            </p>
          </div>
      
        </div>
      
      </section>
      
    </>
  );
}
