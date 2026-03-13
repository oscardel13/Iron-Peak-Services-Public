import CallIcon from '@mui/icons-material/Call';
import METADATA from "@/data/data";


export default function CallButton(){
    return(
        <a className="fixed bottom-5 right-5 flex items-center justify-center rounded-full bg-green-700 text-white w-12 h-12 lg:w-14 lg:h-14 border border-white z-50 hover:cursor-pointer hover:bg-green-400"
            href={`${METADATA.clickablePhone}`}
        >
          <CallIcon/>
        </a>    
    )
}