import React from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export default function Responseexists({
  handlesubmit,
  handlechange,
  dashboardprompt,
  reservedprompt,
  response,
}) {
  return (
    <div className="flex flex-col h-full w-full">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {reservedprompt && (
          <div className="flex justify-end">
            <div className="max-w-md bg-violet-500 text-white px-4 py-3 rounded-2xl">
              {reservedprompt}
            </div>
          </div>
        )}

        {response && (
          <div className="flex justify-start">
            <div className="max-w-md bg-gray-100 text-black px-4 py-3 rounded-2xl">
              {typeof response === "string"
                ? response
                : JSON.stringify(response, null, 2)}
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <form
          onSubmit={handlesubmit}
          className="flex items-center gap-2 max-w-3xl mx-auto border rounded-xl px-4 py-2"
        >
          <input
            type="text"
            name="prompt"
            value={dashboardprompt.prompt}
            onChange={handlechange}
            placeholder="Ask me anything..."
            className="flex-1 outline-none bg-transparent"
          />

          <button
            type="submit"
            className="bg-red-500 text-white rounded-full p-2"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}