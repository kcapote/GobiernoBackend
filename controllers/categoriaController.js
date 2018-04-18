//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();

//GET HTTP method to /categoria
const Categoria = require('../models/categoria');

//GET HTTP method to /categoria
router.get('/', (req, res) => {
    Categoria.find((err, lists) => {
        if (err) {
            res.json({ success: false, message: `La operación no se puede realizar. Error: ${err}` });
        } else {
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();

        }
    });
});

//POST HTTP method to /categoria

router.post('/', (req, res, next) => {
    let categoria = new Categoria({
        name: req.body.name,
        description: req.body.description
    });
    categoria.save((err, resp) => {
        if (err) {
            res.json({ success: false, message: `La operación no se puede realizar. Error: ${err}` });

        } else
            res.json({ success: true, message: "Operación realizada de forma exitosa." });

    });
});

router.put('/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            res.json({ success: false, message: `La operación no se puede realizar. Error: ${err}` });
        }
        if (!categoria) {
            res.json({ success: true, message: "No se pudo encontrar el usuario" });
        }

        categoria.name = req.body.name;
        categoria.description = req.body.description;

        categoria.save((err, resp) => {
            if (err) {
                res.json({ success: false, message: `La operación no se puede realizar. Error: ${err}` });

            } else
                res.json({ success: true, message: "Operación realizada de forma exitosa." });

        });

    })
});

//DELETE HTTP method to /categoria. Here, we pass in a param which is the object id.

router.delete('/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            res.json({ success: false, message: `La operación no se puede realizar. Error: ${err}` });
        } else if (categoria) {
            res.json({ success: true, message: "Operación realizada de forma exitosa." });
        } else
            res.json({ success: false });
    })
});

module.exports = router;