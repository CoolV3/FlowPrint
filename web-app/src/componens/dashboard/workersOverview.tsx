import { MoveRight } from 'lucide-react';


export default function WorkerOverviewComponent() {

    const TestWorkers = [

    ]

    return(
        <div className="flex items-center justify-center pt-10 w-screen shadow-2xl">

                <div className="bg-amber-300 text-black w-80 h-auto flex flex-col p-4 rounded-2xl items-center justify-center gap-4">

                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-xl font-bold">Constis Pi</h1>
                        <div className="border border-dashed bg-white rounded-2xl px-3 py-1 flex items-center justify-center gap-2 shadow-sm">

                            { 1 == 1 && (
                                <>
                                    <div className="bg-green-600 w-2 h-2 rounded-full animate-ping "/>
                                    <span className="text-sm font-medium">Online</span>
                                </>
                            )}

                            { 1 == 2 && (
                                <>
                                    <div className="bg-red-700 w-4 h-4 rounded-full animate-pulse "/>
                                    <span className="text-sm font-medium">Offline</span>
                                </>
                            )}


                        </div>
                    </div>

                    <div className="">
                        <button className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer hover:bg-amber-400 group flex relative transition-all justify-center items-center duration-500">
                            <span className="group-hover:opacity-0 duration-500">Details</span> {<MoveRight className="w-20 h-10 opacity-0 overflow-hidden group-hover:opacity-100 absolute duration-500" />}
                        </button>
                    </div>
                </div>

        </div>
    )
}