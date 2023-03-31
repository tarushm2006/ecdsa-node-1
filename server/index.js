const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const secp = require("ethereum-cryptography/secp256k1");

const balances = {
  "458f9bb0d2d321761be0676279824e9e95db0657": 100,
  "c5cfc8eb7b1d2149caed43904c37743bccb7ed72": 50,
  "68643f64f2717cc285e3c542097f46dfb48faf76": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount,isValid} = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if(isValid){
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {

    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }}else {
    res.status(400).send({message:"Transaction not valid"});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
