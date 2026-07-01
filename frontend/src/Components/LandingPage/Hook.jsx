import ReviewProfiles from "../Profile/ReviewProfiles"
export default function Hook(){
   return(
    <section className="text-center bg-gray-100 p-4">
        <div className="flex flex-col gap-3 p-3 ">
           <h1 className="text-gray-500 "><span className="text-green-500 font-bold   rounded-2xl px-2">LIVE </span>- STUDENTS LOOKING FOR TEAMMATES RIGHT NOW</h1>
           <ReviewProfiles/>
        </div>
        
    </section>
   )
}