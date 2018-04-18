//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();

//GET HTTP method to /categoria
const Categoria = require('../models/categoria');

//GET HTTP method to /categoria
router.get('/', (req, res) => {
    Categoria.find((err, categorias) => {
        if (err) {
            res.status(500).json({
                 success: false, 
                 message: 'No se pueden consultar las Categoría',
                 errors: err 
                });
        } else {
            res.status(200).write(JSON.stringify({ 
                success: true, 
                categorias: categorias 
            }, null, 2));
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
    categoria.save((err, categoriaSave) => {
        if (err) {
            res.status(400).json({
                 success: false, 
                 message: 'No se puede crear la Categoría',
                 errors: err 
                });
        } else {
            res.status(201).json({ 
                success: true, 
                message: 'Operación realizada de forma exitosa.',
                categoria: categoriaSave
            });
        }
    });
});

router.put('/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            res.status(500).json({
                 success: false, 
                 message: 'No se puede actualizar la Categoría',
                 errors: err 
                });
        }

        if (!categoria) {
            res.status(400).json({
                success: false, 
                message: 'No existe una Categoría con el id: '+ id ,
                errors: {message: 'No se pudo encontrar la Categoría para actualizar'} 
            });
        }else{
            categoria.name = req.body.name;
            categoria.description = req.body.description;

            categoria.save((err, categoriaSave) => {
                if (err) {
                    res.status(400).json({
                         success: false, 
                         message: 'No se puede actualizar la Categoría',
                         errors: err 
                        });
                } else{
                    res.status(200).json({ 
                        success: true, 
                        message: 'Operación realizada de forma exitosa.',
                        categoria: categoriaSave
                    });
                }
            });

        }
    })
});

//DELETE HTTP method to /categoria. Here, we pass in a param which is the object id.

router.delete('/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    Categoria.findByIdAndRemove(id, (err, categoriaRemove) => {
        if (err) {
            res.status(500).json({
                 success: false, 
                 message: 'No se puede eliminar la Categoría',
                 errors: err 
                });
        } else if (categoriaRemove) {
            res.status(200).json({ 
                success: true, 
                message: 'Operación realizada de forma exitosa',
                categoria: categoriaRemove 
            });
        } else{
            res.status(400).json({
                success: false, 
                message: 'No existe una Categoría con el id: '+ id ,
                errors: {message: 'No se pudo encontrar la Categoría para eliminar'} 
               });
        }
    })
});

module.exports = router;