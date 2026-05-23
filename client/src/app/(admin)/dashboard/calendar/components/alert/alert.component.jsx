import Popover from "../../../../../components/popover/popover.component";


const Alert = ({children, closeAlert, confirmAlert}) =>{
    return (
        <Popover closeTrigger={closeAlert}>
            <div className="relative flex flex-col px-3 py-5 bg-white w-screen md:w-[768px] rounded-lg shadow-lg border">
                {children}
                <br/>
                <div className="flex flex-row justify-between text-white">
                    <button className="flex p-5 border shadow-lg bg-red-500 hover:bg-red-400 rounded-lg w-40 justify-center" onClick={closeAlert}>
                        Exit
                    </button>
                    <button className="flex p-5 border shadow-lg bg-green-500 hover:bg-green-400 rounded-lg w-40 justify-center" onClick={confirmAlert}>
                        confirm
                    </button>
                </div>
            </div>
        </Popover>
    )
}

export default Alert;