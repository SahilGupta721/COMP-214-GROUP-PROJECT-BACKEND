const oracledb = require('oracledb');

const dbConfig = {
    user: 'COMP214_F24_er_10',
    password: 'password',
    connectString: '199.212.26.208:1521/SQLD' //your_host:your_port/your_service_name',
  };
  


  module.exports.display = async function(req,res,next){
    try{
      let connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('SELECT * FROM hr_employees');
      res.json(result.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch data from the database' }); // Return error response
    } 
  }
