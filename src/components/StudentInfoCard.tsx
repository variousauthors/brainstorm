import React, { useState } from "react";

export function StudentInfoCard () {
  const [state, setState] = useState(0);

  return (
    <div className="w-full rounded shadow bg-white md:px-6 px-2 py-8 flex flex-col items-center md:max-w-sm md:mr-5 mb-6">
      <div className="rounded-full w-20 h-20 border-4 border-gray-100">
        <img className="w-full h-full object-cover object-center" src="./assets/images/enrolled-student-1.png" alt="student" />
      </div>
      <h5 className="mt-4 mb-2 text-gray-800">Timothy Jon Oliphant</h5>
      <p className="text-xs text-gray-600">Marketing Manager</p>
      <div className="text-xs text-gray-600" onClick={() => setState((prev) => prev + 1)}>Age: {state}</div>
      <div className="flex items-start my-8">
        <div className="">
          <h2 className="text-gray-600 text-xl leading-6 mb-2 text-center">
            08
          </h2>
          <p className="text-gray-800 text-xs leading-5">Quizzes</p>
        </div>
        <div className="mx-6 lg:mx-3 xl:mx-4 px-8 lg:px-4 xl:px-4 border-l border-r">
          <h2 className="text-gray-600 text-xl leading-6 mb-2 text-center">
            12
          </h2>
          <p className="text-gray-800 text-xs leading-5">Assignments</p>
        </div>
        <div className="">
          <h2 className="text-gray-600 text-xl leading-6 mb-2 text-center">
            03
          </h2>
          <p className="text-gray-800 text-xs leading-5">Projects</p>
        </div>
      </div>
      <div className="text-xs text-gray-600 mb-3 px-6">33% Completion</div>
      <div className="w-full h-1 bg-gray-200 rounded relative ">
        <div className="w-1/3 bg-indigo-500 h-1 rounded absolute"></div>
      </div>
      <button className="w-full sm:w-auto color-blue mt-6 bg-gray-200 hover:bg-gray-300 text-sm py-2 px-6 transition duration-150 ease-in-out rounded">
        Send Message
      </button>
    </div>
  )
}