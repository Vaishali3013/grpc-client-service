var express = require("express");
var bodyParser = require("body-parser");
const client = require("./client");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// expose rest call which internally call grpc server fubction using grpc client
app.get("/", (req, res) => {
  client.getAll(null, (err, data) => {
    if (!err) {
      res.send(data.customers);
    }
  });
});

app.get("/get/:id", (req, res) => {
  client.get({ id: req.params.id }, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});

app.post("/create", (req, res) => {
  let newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };
  client.insert(newCustomer, (err, data) => {
    if (err) throw err;
    res.send({ message: "customer added successfully", data });
  });
});

app.post("/update", (req, res) => {
  let updateCustomer = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };
  client.updatte(updateCustomer, (err, data) => {
    if (err) throw err;
    res.send({ message: "customer updated successfully", data });
  });
});

app.post("/remove/:id", (req, res) => {
  client.remove({ id: req.params.id }, (err, _) => {
    res.send({ message: "Customer removed successfully" });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
});
