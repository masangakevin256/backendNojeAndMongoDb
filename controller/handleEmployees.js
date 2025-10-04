const { ObjectId } = require("mongodb");
const {getEmployeesDb} = require("../model/employeesDb");

const getAllEmployees = async (req,res)=>{
    const db =  getEmployeesDb();
    //check if db exists
    if(!db) return res.status(400).json({"Error": "Database not initialized"});

   
   try {
     const employees = await db.collection("employees")
            .find()
            .sort({"name": 1})
            .toArray();
         res.status(200).json(employees);
   } catch (error) {
    console.log(error)
        res.status(500).json({"Message": "Could not fetch employees"});
   }
}
const addNewEmployee = async (req, res) => {
    const validPaymentMethods = ["Paypal", "M-pesa", "Visa", "Cash"];
    const db = getEmployeesDb();
    const employee = req.body;

    if (!db) {
        return res.status(400).json({ "Message": "Database is not initialized!!" });
    }

    try {
        // Validate required fields
        if (!employee.name || !employee.amount) {
            return res.status(400).json({ "Message": "Name and amount to be paid are required" });
        }

        // Default payment method to "M-pesa" if not provided
        const method = employee.paymentMethod || "M-pesa";

        // Validate payment method
        if (!validPaymentMethods.includes(method)) {
            return res.status(400).json({ "Message": `Invalid payment method. Choose one of: ${validPaymentMethods.join(", ")}` });
        }

        // Check for duplicate employee by name
        const duplicate = await db.collection("employees").findOne({ name: employee.name });
        if (duplicate) {
            return res.status(409).json({ "Message": `Employee with name ${employee.name} already exists` });
        }

        const employeeFormat = {
            name: employee.name,
            amount: employee.amount,
            method: method,
            "role": employee.role || "employee"
        };

        await db.collection("employees").insertOne(employeeFormat);

        res.status(201).json({ 
            "Success": `Employee ${employee.name} created successfully`, 
            employee: employeeFormat 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ "Message": "Failed to create a new employee!!" });
    }
};

const updateEmployee = async (req,res) =>{
    const db = getEmployeesDb();
    const {id} = req.params;
    const updates = req.body;

    if(!db) return res.status(400).json({"Error": "Database not initialized"});
    if(!id) return res.status(400).json({"Error": "Id not Found"});    
    if(!updates) return res.status(400).json({"Error": "No  updates Found"});  

   try {
        await db.collection("employees")
            .updateOne({_id: new ObjectId(id)}, {$set: updates});

        res.status(200).json({"Message": "Updated successfully"}, updates)
   }catch (error) {
    res.status(500).json({"Error": "Could not update employee"});
   }


}
const deleteEmployee = async (req,res) => {
    const db = getEmployeesDb();
    const {id} = req.params;
    if(!db) return res.status(400).json({"Error": "Database not initialized"});
    if(!id) return res.status(400).json({"Error": "Id not Found"});  

    try {
        const results =  await db.collection("employees")
            .deleteOne({_id: new ObjectId(id)})

        if(results.deleteCount === 0){
            return res.status(404).json({"Message": "Employee with that id already deleted!!"});
        }
        res.status(200).json({"Message": `Employee with id ${id} deleted`});
    } catch (error) {
        return res.status(500).json({"Message": "Failed to delete Employee!!"})
    }

}
const getEmployee = async (req, res) => {
    const db = getEmployeesDb();
    const {id} = req.params;

    if(!db) return res.status(400).json({"Error": "Database not initialized"});
    if(!id) return res.status(400).json({"Error": "Id not Found"}); 

    try {
        const results = await db.collection("employees")
            .findOne({_id: new ObjectId(id) })

        res.status(200).json(results)
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = {
    getAllEmployees,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}