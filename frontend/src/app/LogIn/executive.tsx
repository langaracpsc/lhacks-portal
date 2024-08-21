// page for qrCode scan by executives

import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { useAuthStore } from '../Store/AuthStore';
import { useReducer } from 'react';

export default function ScanQrCode({ Type }: { Type: number }) {
    const [, update] = useReducer(x => x + 1, 0);

    const  App = () => {
        const token = useAuthStore((state: any) => state.Token);

        return <Scanner scanDelay={1000} onScan={async (result) => {
            if (result.length > 0) {
                const response = await (await fetch(`https://${process.env.API_URL}/scan/create`, {
                    method: "POST",
                    mode: "cors",
                    body: JSON.stringify({
                        "userid": result[0].rawValue,
                        "type": Type,
                        "meal": "Lunch" 
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })).json();
                
                alert(`Code scanned: ${response.scan.user_id}: ${result[0].rawValue}`)
                update();
            }
        }} />;
    }

    return (<>
        <div className='w-52 h-52 '>
            <App />
        </div>
    </>)
}