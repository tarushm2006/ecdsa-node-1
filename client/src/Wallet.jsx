import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp.getPublicKey(privateKey);
    setAddress(toHex(keccak256(publicKey).slice(-20)));
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance("error");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Enter your Private Key
        <input placeholder="Type Your Private key" value={privateKey} onChange={onChange}></input>
      </label>
       Address: {address}
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
