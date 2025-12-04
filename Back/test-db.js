const mysql = require("mysql2/promise");

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "tienda"
        });

        console.log("CONEXION EXITOSA A MYSQL CON XAMPp");
        process.exit();
    } catch (e) {
        console.log("ERROR DE CONEXION:");
        console.log(e);
    }
})();
