import express from "express";
import cors from "cors";

const app = express();

import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js"; 

const PORT = environments.port;

//PARSEAR JSON
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto", PORT);
});

app.get("/productos", async (req, res) => {
    try {
        let sql = "SELECT * FROM products";
        let [rows] = await connection.query(sql);
        res.status(200).json({
            payload: rows,
            message: "Productos encontrados"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: "Error al obtener productos"
        });
    }
});

app.get("/productos/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let sql = "SELECT * FROM products WHERE id = ?";
        let [rows] = await connection.query(sql, [id]);
        res.status(200).json({
            payload: rows,
            message: "Producto encontrado"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: "Error al obtener productos"
        });
    }
});

app.post("/productos", async (req, res) => {
    try {
        console.log("POST /productos -> body recibido:", req.body);

        const { name, category, price, image, active } = req.body;

        // Validación básica
        if (!name || !category || price === undefined) {
            console.log("Faltan campos obligatorios:", { name, category, price });
            return res.status(400).json({ message: "Faltan campos obligatorios (name, category, price)" });
        }

        // Asegurarse tipos
        const precioNum = Number(price);
        const activoNum = active !== undefined ? Number(active) : 1;

        const sql = "INSERT INTO products (name, category, price, image, active) VALUES (?, ?, ?, ?, ?)";
        const [result] = await connection.query(sql, [name, category, precioNum, image || '', activoNum]);

        console.log("Resultado INSERT:", result);
        if (result && result.insertId) {
            return res.status(201).json({ message: "Producto creado exitosamente", id: result.insertId });
        } else {
            console.log("INSERT no devolvió insertId:", result);
            return res.status(500).json({ message: "No se pudo insertar el producto" });
        }
    } catch (error) {
        console.error("Error en POST /productos:", error);
        return res.status(500).json({ message: "Error interno al crear producto", error: error.message });
    }
});



app.put("/productos", async (req, res) => {
    try {
        const { id, name, category, price, image, active } = req.body;
        if (!id) return res.status(400).json({ message: "Falta el id en el body" });

        let sql = "UPDATE products SET name=?, category=?, price=?, image=?, active=? WHERE id=?";
        let [result] = await connection.query(sql, [name, category, price, image, active, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });

        res.json({ message: "Producto actualizado (ruta /productos)" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error interno" });
    }
});

app.delete("/productos/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let sql = "DELETE FROM products WHERE id = ?";
        let [result] = await connection.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Error interno" });
    }
});
