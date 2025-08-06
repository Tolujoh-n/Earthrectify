import { connectToMetamask } from "../services/wallets/metamask/metamaskClient";
import { openWalletConnectModal } from "../services/wallets/walletconnect/walletConnectClient";
import MetamaskLogo from "../assets/metamask-logo.svg";
import WalletConnectLogo from "../assets/walletconnect-logo.svg";

interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (value: string) => void;
}

export const WalletSelectionDialog = ({
  open,
  setOpen,
  onClose,
}: WalletSelectionDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={() => {
              openWalletConnectModal();
              setOpen(false);
            }}
          >
            <img
              src={WalletConnectLogo}
              alt="walletconnect logo"
              className="w-6 h-6 -ml-1"
            />
            WalletConnect
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={() => {
              connectToMetamask();
              setOpen(false);
            }}
          >
            <img
              src={MetamaskLogo}
              alt="metamask logo"
              className="w-6 h-6 pl-0 pr-1"
            />
            Metamask
          </button>
        </div>
      </div>
    </div>
  );
};
