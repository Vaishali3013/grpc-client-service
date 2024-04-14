const PROTO_PATH = './customers.proto';
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { uuid } = require('uuidv4');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server()

const customers = [{
    id: 'sdhtdfsf',
    name: 'VAISHALI',
    age: 12,
    address: 'Nabha'
},
{
    id: 'sdhtdsdee',
    name: 'VAISHALI Jindal',
    age: 24,
    address: 'Punjab'
}]

server.addService(customersProto.customerService.service, {
    getAll: (call, callback) => {
        callback(null, { customers })
    },
    get: (call, callback) => {
        let customer = customers.find(item => item.id === call.request.id);

        if (customer) {
            callback(null, customer)
        }
        else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not Found"
            })
        }
    },
    insert: (call, callback) => {
        let customer = call.request;
        customer.id = uuid()
        customers.push(customer)
        callback(null, customer)
    },
    update: (call, callback) => {
        let customer = customers.find(item => item.id === call.request.id);

        if (customer) {
            customer = { ...customer, id: call.request.id }
            callback(null, customer)
        }
        else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not Found"
            })
        }

    },
    remove: (call, callback) => {
        let customer = customers.findIndex(item => item.id === call.request.id);

        if (customer) {
            customers.splice(customer, 1)
            callback(null, {})
        }
        else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not Found"
            })
        }
    },
});
server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(`Error starting grpc: ${err}`)
    }
    else {
        server.start();
        console.error(`grpc server is at port: ${port}`)

    }
});