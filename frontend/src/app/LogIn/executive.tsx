// page for qrCode scan by executives

import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';


export default function ScanQrCode(){

    const App = () => {
        return <Scanner scanDelay={1000} allowMultiple={true} onScan={(result) => {
            console.log(result)


        }} />
    }


    return (<>
    
        <div className='w-52 h-52 '>
        <App/>
        </div>
    
    </>)



}