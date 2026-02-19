 export default function About() {
  return (
   <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-blue-50 p-6 items-start justify-start ">
      <div className="flex flex-col gap-3">
        <h2 className="text-purple-400 font-bold text-2xl mb-2">
          About
          </h2>
          <p className="text-black font-serif text-lg ">
            <span className="text-black font-bold text-lg">CollabGenius</span> is the next generation collaborative platform built for researchers , developers, and global teams who refuse to let geography limit innovation.
            Founded by a driven-second year computer science student from <span className="text-black font-bold text-lg">INDIA </span>,we are reimagining code collaboration beyond Github's constraints, seamless, AI powered and truly borderless
          </p>
      </div>
     
      </div>
     <div className="bg-blue-50 p-6 items-start justify-start">
      <div className="flex flex-col gap-3">
       <h2 className="text-purple-400 font-bold text-2xl mb-2">
        Features Provided 
       </h2>
       <div className="flex flex-col gap-3">
        <h1 className="font-bold">Project creation</h1>
        <h1 className="font-bold">Join project all across the WORLD</h1>
        <h1 className="font-bold">CHOOSE PROJECT OF YOUR DOMAIN</h1>
       </div>
      </div>
     </div>
    </div>
  );
}
