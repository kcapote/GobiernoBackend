const express = require('express');
const router = express.Router();

const Category = require('../models/category');

router.get('/', (req, res) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Category.find()
        .skip(pagination)
        .limit(10)
        .exec(
            (err, categories) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Categoría',
                        errors: err
                    });
                } else {

                    Category.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            categories: categories,
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/search/:term', (req, res) => {

    let term = req.params.term;
    var regex = new RegExp(term, 'i');

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Category.find()
        .or([{ 'name': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(pagination)
        .limit(10)
        .exec(
            (err, categories) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se encontrarón resultados',
                        errors: err
                    });
                } else {

                    Category.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            categories: categories,
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/:id', (req, res, next) => {

    let id = req.params.id;

    Category.findById(id, (err, category) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Categoría',
                errors: err
            });
        }
        if (!category) {
            res.status(400).json({
                success: false,
                message: 'No existe una Categoría con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Categoría para actualizar' }
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                category: category
            });
        }
    })
});

router.post('/', (req, res, next) => {
    let category = new Category({
        name: req.body.name,
        description: req.body.description
    });
    category.save((err, categorySave) => {
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
                category: categorySave
            });
        }
    });
});

router.put('/:id', (req, res, next) => {

    let id = req.params.id;

    Category.findById(id, (err, category) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Categoría',
                errors: err
            });
        }

        if (!category) {
            res.status(400).json({
                success: false,
                message: 'No existe una Categoría con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Categoría para actualizar' }
            });
        } else {
            category.name = req.body.name;
            category.description = req.body.description;

            category.save((err, categorySave) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la Categoría',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        category: categorySave
                    });
                }
            });

        }
    })
});


router.delete('/:id', (req, res, next) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryRemove) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede eliminar la Categoría',
                errors: err
            });
        } else if (categoryRemove) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                category: categoryRemove
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No existe una Categoría con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Categoría para eliminar' }
            });
        }
    })
});

module.exports = router;