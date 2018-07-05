const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');

const Notice = require('../models/notice');

router.get('/', (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Notice.find()
        .skip(pagination)
        .limit(10)
        .exec(
            (err, notices) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Noticias',
                        errors: err,
                        user: req.user
                    });
                } else {

                    Notice.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            notices: notices,
                            totalRecords: totalRecords,
                            pagination: pagination,
                            user: req.user
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/last', (req, res, next) => {

    Notice.find()
        .limit(3)
        .populate('user')
        .exec(
            (err, notices) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Noticias',
                        errors: err,
                        user: req.user
                    });
                } else {

                    Notice.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            notices: notices,
                            totalRecords: totalRecords,
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

    Notice.find()
        .or([{ 'title': regex }, { 'description': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(pagination)
        .limit(10)
        .exec(
            (err, notices) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se encontrarón resultados',
                        errors: err,
                        user: req.user
                    });
                } else {
                    Notice.find()
                        .or([{ 'name': regex }])
                        .count({}, (err, totalRecords) => {
                            res.status(200).write(JSON.stringify({
                                success: true,
                                notices: notices,
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

    Notice.findById(id, (err, notice) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Categoría',
                errors: err,
                user: req.user
            });
        }
        if (!notice) {
            res.status(400).json({
                success: false,
                message: 'No existe una Noticia con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Noticia' },
                user: req.user
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                notice: notice,
                user: req.user
            });
        }
    })
});

router.post('/', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {
    let notice = new Notice({
        title: req.body.title,
        description: req.body.description,
        creationDate: new Date(),
        user: req.body.user
    });
    notice.save((err, notice) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear la Noticia',
                errors: err,
                user: req.user
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                notice: notice,
                user: req.user
            });
        }
    });
});

router.put('/:id', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {

    let id = req.params.id;

    Notice.findById(id, (err, notice) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Noticia',
                errors: err,
                user: req.user
            });
        }

        if (!notice) {
            res.status(400).json({
                success: false,
                message: 'No existe una Noticia con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Noticia para actualizar' },
                user: req.user
            });
        } else {

            notice.title = req.body.title,
                notice.description = req.body.description,
                notice.updateDate = new Date(),
                notice.user = req.body.user

            notice.save((err, notice) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la Noticia',
                        errors: err,
                        user: req.user
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        notice: notice,
                        user: req.user
                    });
                }
            });

        }
    })
});


router.delete('/:id', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {

    let id = req.params.id;

    Notice.findByIdAndRemove(id, (err, notice) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede eliminar la Noticia',
                errors: err,
                user: req.user
            });
        } else if (notice) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                notice: notice,
                user: req.user
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No existe una Noticia con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Noticia para eliminar' },
                user: req.user
            });
        }
    })
});

module.exports = router;