import { ReactNode } from "react";
import { MetamaskContextProvider } from "../../components/MetamaskContext";
import { WalletConnectContextProvider } from "../../components/WalletConnectContext";
import { MetaMaskClient } from "./metamask/metamaskClient";
import { WalletConnectClient } from "./walletconnect/walletConnectClient";

export const AllWalletsProvider = (props: {
  children: ReactNode | undefined;
}) => {
  return (
    <MetamaskContextProvider>
      <WalletConnectContextProvider>
        <MetaMaskClient />
        <WalletConnectClient />
        {props.children}
      </WalletConnectContextProvider>
    </MetamaskContextProvider>
  );
};
