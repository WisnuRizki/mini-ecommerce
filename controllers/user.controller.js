const { User, Role ,Balance,Product,History, sequelize } = require('../models/index')
const bcrypt = require('bcrypt')
const { generateToken } = require('../middleware/authentication');

const signUp = async (req, res) => {
    const body = req.body;
    const username = body.username;
    const email = body.email;
    const password = bcrypt.hashSync(body.password, 10);
    // Cek di Database apakah user ada atau enggk => User telah terdaftar 
    // Password => Encrypt
    

    try {

        const result = await sequelize.transaction(async (t) => {
        
            const findUser = await User.findOne({
                where: {
                    email: email
                }
            }, { transaction: t })

            if(findUser === null){
                const user = await User.create({
                    username: username,
                    email: email,
                    password: password
                  }, { transaction: t });
        
                  const role = await Role.create({
                    user_id: user.id
                  }, { transaction: t });

                  return res.status(200).json({
                    status: 'success',
                    message: 'Sukses menambahkan user',
                    data: user
                })
            }else{
                return res.status(400).json({
                    status: 'Gagal',
                    message: 'Gagal menambahkan User'
                })
            }
        
      
        });
      
      } catch (error) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal menambahkan User'
        })
      }
};

const login = async (req,res) => {
    const {email,password} = req.body;
    console.log(email,password)
   await User.findOne({
        where: {
            email: email
        },
        include: {
            model: Role,
            as: 'FkUserRole'
        }
    }).then( user => {
        const passwordValid = bcrypt.compareSync(password, user.password);

            if(!passwordValid) {                        
                return res.status(401).send({
                    message: "Email and Password is not match"
                });
            }

           let data = {
                id: user.id,
                username: user.username,
                role: user.FkUserRole.role
            }

            let token = generateToken(data);

            return res.status(200).send({
                status: "SUCCESS",
                message:"User Login Success",
                data: {
                   data,
                   token: token
                }
            })
    }).catch(e => {
        return res.status(400)
    })
};

const getAllProduct = async (req,res) => {
    await Product.findAll().then(data => {
        res.status(200).json({
            status: 'Success',
            data: data
        })
    }).catch(e => {
        res.status(400).json({
            status: 'Fail',
    
        })
    })
}

const getProductByName = async (req,res) => {
    const {name} = req.body;
    await Product.findOne({
        where: {
            name: name
        }
    }).then(data => {
        res.status(200).json({
            status: 'Success',
            data: data
        })
    }).catch(e => {
        res.status(400).json({
            status: 'Fail',
        })
    })
};

const inputProduct = async (req,res) => {
    const {name,category,price,quantity} = req.body;
 
    if(req.role === 'admin'){
         Product.findOne({
            where: {
                name: name
            }
        }).then(data => {
            if(data === null){
                 Product.create({
                    name: name,
                    category: category,
                    price: price,
                    quantity: quantity
                }).then(data => {
                    res.status(200).json({
                        status: 'Success',
                        message: 'berhasil menambahkan product',
                        data: data
                    })
                })
            }else{
                res.status(400).json({
                    status: 'Gagal',
                    message: 'Anda tidak dapat menambahkan product'
                })
            }
        })
    }else{
        res.status(400).json({
            status: 'Gagal',
            message: 'Anda tidak dapat menambahkan product'
        })
    }

    

    // if(req.role === 'admin'){
    //     Product.create({
    //         name: name,
    //         category: category,
    //         price: price,
    //         quantity: quantity
    //     }).then(data => {
    //         res.status(200).json({
    //             status: 'Success',
    //             message: 'berhasil menambahkan product',
    //             data: data
    //         })
    //     })
    // }else{
    //     res.status(400).json({
    //         status: 'Gagal',
    //         message: 'Anda tidak dapat menambahkan product'
    //     })
    // }
    
}

const topUp = async (req,res) => {
    const {user_id,amount} = req.body;

    if(req.role === 'admin'){
        await Balance.findOne({
            where: {
                user_id: user_id
            }
        }).then(data => {
            if(data === null){
                 Balance.create({
                    user_id: user_id,
                    amount: amount
                }).then(data => {
                    res.status(200).json({
                        status: 'Success',
                        message: 'Berhasil Top up',
                        data: data
                    })
                }).catch(e => {
                    res.status(400).json({
                        status: 'Gagal',
                        message: 'Gagal Top up',
                        data: data
                    })
                })
            }else{
                let total = data.amount + amount;
                Balance.update({amount: total},{
                    where: {
                        user_id: user_id
                    }
                }).then(data => {
                    res.status(200).json({
                        status: 'Success',
                        message: 'Berhasil Top up',
                    })
                }).catch(e => {
                    res.status(400).json({
                        status: 'Gagal',
                        message: 'Gagal Top up',
                        data: data
                    })
                })
            }
        })
    }
}

const purchaseProduct = async (req,res) => {
    const {name,quantity} = req.body;

    try {

        const result = await sequelize.transaction(async (t) => {
            const findProduct = await Product.findOne({
                where: {
                    name: name
                }
            }, { transaction: t })
         
            const findBalance = await Balance.findOne({
                where: {
                    user_id: req.id
                }
            }, { transaction: t })
         
            let totalPrice = findProduct.price * quantity;
         
            if(findBalance.amount > totalPrice){
                let amountBalance = findBalance.amount - totalPrice;
                const changeBalance = await Balance.update({amount: amountBalance},{
                    where: {
                        user_id: req.id
                    }
                }, { transaction: t })
        
                
                let newQuantity = findProduct.quantity - quantity;
                const changeQuantity = await Product.update({quantity: newQuantity},{
                    where: {
                        name: name
                    }
                }, { transaction: t })
               
                

                const createHisotry = await History.create({
                    user_id: req.id,
                    produt_id: findProduct.id,
                    quantity: quantity,
                    total_price: totalPrice
                  }, { transaction: t });


                  res.status(200).json({
                      status: 'Success',
                      message: 'Pembelian berhasil',
                      
                  })

                
            }else{
                res.status(400).json({
                    status: 'Fail',
                    message: 'Gagal',
                    
                })
            }
      
        });
      
      } catch (error) {
        res.status(400).json({
            status: 'Gagal',
            message: 'Gagal membeli product',
            
        })
      }
}

const getHistory = async (req,res) => {
    await History.findAll({
        where: {
            user_id: req.id
        },
        attributes: [
            'id',
            'quantity',
            'total_price',
            [sequelize.literal(`"FkHistoryUser"."username"`), "username"],
            [sequelize.literal(`"FkHistoryProduct"."name"`), "name"],
        ],
        subQuery: false,
        include:[{
            model: Product,
            as: 'FkHistoryProduct',
            attributes: []
        },{
            model: User,
            as: 'FkHistoryUser',
            attributes: []
        }]
        // include: {
        //     model: User,
        //     as: 'FkHistoryUser',   
        // }
    }).then(data => {
        res.status(200).json({
            status: 'Success',
            data: data
        })
    }).catch(e => {
        res.status(400).json({
            status: 'Gagal',
            message: 'Gagal mengambil history'
        })
    })
}

const getBalance = async (req,res) => {
    await Balance.findOne({
        where: {
            user_id: req.id
        }
    }).then(data => {
        res.status(200).json({
            status: 'Success',
            data: data
        })
    }).catch(e => {
        res.status(400).json({
            status:"Fail"
        })
    })
}

module.exports = {
    signUp,
    login,
    inputProduct,
    getAllProduct,
    topUp,
    purchaseProduct,
    getHistory,
    getProductByName,
    getBalance
}