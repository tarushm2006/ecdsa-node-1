import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"; 
import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes,toHex } from "ethereum-cryptography/utils"

function Transfer({ address, setBalance,privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const messageBytes = utf8ToBytes(address+sendAmount+recipient);
    const messageHash = sha256(messageBytes);
    const publicKey = secp.getPublicKey(privateKey);
    const sign = await secp.sign(toHex(messageHash),privateKey);
    const isSigned = secp.verify(sign,messageHash,publicKey);
    console.log(isSigned);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        isValid: isSigned,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
