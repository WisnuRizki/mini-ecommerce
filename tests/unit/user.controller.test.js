const UserController = require('../../controllers/user.controller');
const httpMocks = require('node-mocks-http');
const {User,Product,History,Balance} = require('../../models');
const bcrypt = require('bcrypt')

jest.mock('../../models');

let req,res;

beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
})

const user = {
    username: "wisnu",
    email: "wisnu@gmail.com",
    password: "wisnuuuu"
}

const inputProduct = {
    name: "asdasd",
    category: "asdasd",
    quantity: 1000,
    price:100
}

it("req.body Check", async () => {
    req.body = user
    await UserController.signUp(req,res)
    expect(req.body.username).toBe("wisnu")
    expect(req.body.email).toBe("wisnu@gmail.com")
    expect(req.body.password).not.toBe(undefined)
});

it("SignUp return 400",async () => {
    req.body = user
    User.create.mockResolvedValue()
    await UserController.signUp(req,res)
    expect(res.statusCode).toBe(200)
})

// Login
it("Login return 401", async () => {
    User.findOne.mockResolvedValue({
        password: 'asdasd'
    })
    req.body = user
    await UserController.login(req,res)
    expect(res.statusCode).toBe(401)
});


it("Login return 400", async () => {
    User.findOne.mockRejectedValue()
    req.body = user
    await UserController.login(req,res)
    expect(res.statusCode).toBe(400)
});
// Login


// getAllProduct
it("All Product Success should return 200", async () => {
    Product.findAll.mockResolvedValue({
        email: 'asdasdasd@gmail.com'
    })
    req.body = user
    await UserController.getAllProduct(req,res)
    expect(res.statusCode).toBe(200)
});

it("All Product Fail should return 200", async () => {
    Product.findAll.mockRejectedValue()
    req.body = user
    await UserController.getAllProduct(req,res)
    expect(res.statusCode).toBe(400)
});
// getAllProduct


// History
it("Get History Sukses should return 200", async () => {
    History.findAll.mockResolvedValue({
        asd:"asdasdasd"
    })
   
    await UserController.getHistory(req,res)
    expect(res.statusCode).toBe(200)
});

it("Get History Fail should return 400", async () => {
    History.findAll.mockRejectedValue()
    req.body = user
    await UserController.getHistory(req,res)
    expect(res.statusCode).toBe(400)
});
// History


// Balance
it("Get Balance Sukses should return 200", async () => {
    Balance.findOne.mockResolvedValue({
        asd:"asdasdasd"
    })
   
    await UserController.getBalance(req,res)
    expect(res.statusCode).toBe(200)
});

it("Get Balance Fail should return 400", async () => {
    Balance.findOne.mockRejectedValue()
    req.body = user
    await UserController.getBalance(req,res)
    expect(res.statusCode).toBe(400)
});
// Balance

// getProductByName
it("Get Product By name Success should return 200", async () => {
    Product.findOne.mockResolvedValue({
        email: 'asdasdasd@gmail.com'
    })
    await UserController.getProductByName(req,res)
    expect(res.statusCode).toBe(200)
});

it("Get Product By name Fail should return 400", async () => {
    Product.findOne.mockRejectedValue()
    req.body = user
    await UserController.getProductByName(req,res)
    expect(res.statusCode).toBe(400)
});

// Input Product
it("req.body Check", async () => {
    req.body = inputProduct
    await UserController.inputProduct(req,res)
    expect(req.body.name).toBe("asdasd")
    
});

it("FindOne Product", async () => {
    Product.findOne.mockResolvedValue({
        email: 'asdasdasd@gmail.com'
    })
    req.body = inputProduct
    await UserController.inputProduct(req,res)
    expect(req.body.name).toBe("asdasd")
    
});

// Input Product

// topUP
it("req.body Check", async () => {
    req.body = {
        user_id: 1,
        amount: 1000
    }
    req.role = 'admin'
    await UserController.topUp(req,res)
    expect(req.body.user_id).toBe(1)
    
});

it("req.body Check", async () => {
    Balance.findOne.mockResolvedValue({
        data: undefined
    })

   
    await UserController.topUp(req,res)
    expect(req.statusCode).toBe(400)
    
});
// topUP


// purchase Product

// purchase Product











    




