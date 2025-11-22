const mysql = require("mysql2/promise");

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "tienda"
        });

        console.log("✔ CONEXIÓN EXITOSA A MYSQL CON XAMPP");
        process.exit();
    } catch (e) {
        console.log("❌ ERROR DE CONEXIÓN:");
        console.log(e);
    }
})();
