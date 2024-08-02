import { create } from 'zustand'

export interface CheckInInfo {
    CheckedIn: boolean,
    Time: number
}

export const useAuthStore = create((set) => ({
    User: {
        Checkin: {
            
        } as CheckInInfo 
    },

    Token: null,    

    SetToken: (token: string) => set({Token: token}),
    SetUser: (user: any) => set({User: user}),
    CheckIn: (scan: any) => set(({ User: {} }))
}));

