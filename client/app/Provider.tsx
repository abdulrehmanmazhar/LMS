import React, {ReactNode} from "react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "../redux/store";

interface ProviderProps {
    children: ReactNode;

}

export function Providers ({children}: ProviderProps){
    return <StoreProvider store={store}>{children}</StoreProvider>
}