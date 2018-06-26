const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');

const Category = require('../models/category');

router.get('/', (req, res, next) => {

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
                        errors: err,
                        user: req.user
                    });
                } else {

                    Category.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            categories: categories,
                            totalRecords: totalRecords,
                            pagination: pagination,
                            user: req.user
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/all', (req, res, next) => {

    Category.find()
        .exec(
            (err, categories) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Categoría',
                        errors: err,
                        user: req.user
                    });
                } else {

                    Category.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            categories: categories,
                            totalRecords: categories.length,
                            user: req.user
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/search/:term', (req, res, next) => {

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
                        errors: err,
                        user: req.user
                    });
                } else {
                    Category.find()
                            .or([{ 'name': regex }])     
                            .count({}, (err, totalRecords) => {
                                res.status(200).write(JSON.stringify({
                                    success: true,
                                    categories: categories,
                                    totalRecords: totalRecords,
                                    pagination: pagination,
                                    user: req.user
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
                errors: err,
                user: req.user
            });
        }
        if (!category) {
            res.status(400).json({
                success: false,
                message: 'No existe una Categoría con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Categoría para actualizar' },
                user: req.user
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                category: category,
                user: req.user
            });
        }
    })
});

router.post('/', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {
    let category = new Category({
        name: req.body.name,
        description: req.body.description
    });
    category.save((err, categorySave) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear la Categoría',
                errors: err,
                user: req.user
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                category: categorySave,
                user: req.user
            });
        }
    });
});

router.put('/:id', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {

    let id = req.params.id;

    Category.findById(id, (err, category) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Categoría',
                errors: err,
                user: req.user
            });
        }

        if (!category) {
            res.status(400).json({
                success: false,
                message: 'No existe una Categoría con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Categoría para actualizar' },
                user: req.user
            });
        } else {
            category.name = req.body.name;
            category.description = req.body.description;

            category.save((err, categorySave) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la Categoría',
                        errors: err,
                        user: req.user
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        category: categorySave,
                        user: req.user
                    });
                }
            });

        }
    })
});


router.delete('/:id', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryRemove) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede eliminar la Categoría',
                errors: err,
                user: req.user
            });
        } else if (categoryRemove) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                category: categoryRemove,
                user: req.user
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No existe una Categoría con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Categoría para eliminar' },
                user: req.user
            });
        }
    })
});

module.exports = router;