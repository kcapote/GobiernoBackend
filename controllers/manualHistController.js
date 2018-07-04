const express = require('express');
const router = express.Router();

const ManualHist = require('../models/manualHist');
const authentication = require('../middlewares/authentication');


router.get('/', (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    ManualHist.find({}, 'name description version creationDate updateDate category user linkFile ')
        .populate('category')
        .populate('user')
        .skip(pagination)
        .limit(10)
        .sort({creationDate: 'descending'})
        .exec(
            (err, manuals) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar los manuales',
                        errors: err,
                        user: req.user
                    });
                } else {
                    ManualHist.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            manuals: manuals,
                            totalRecords: manuals.length,
                            pagination: pagination,
                            user: req.user
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/file/:idManualHist', (req, res, next) => {

    let idManualHist = req.params.idManualHist;

    ManualHist.find({ '_id': idManualHist }, 'file')
        .exec(
            (err, manual) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar el archivo',
                        errors: err,
                        user: req.user
                    });
                } else {
                    res.status(200).write(JSON.stringify({
                        success: true,
                        manual: manual,
                        user: req.user
                    }, null, 2));
                    res.end();
                }
            });
});


router.get('/last', (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    ManualHist.find({},'name description version creationDate updateDate category user linkFile ')
        .populate('category')
        .populate('user')
        .limit(3)
        .sort({creationDate: 'descending'})
        .exec(
            (err, manuals) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar los manuales',
                        errors: err,
                        user: req.user
                    });
                } else {
                    ManualHist.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            manuals: manuals,
                            totalRecords: manuals.length,
                            pagination: pagination,
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

    ManualHist.find({},'name description version creationDate updateDate category user linkFile ')
        .populate('category')
        .populate('user')
        .or([{ 'name': regex }, { 'description': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(pagination)
        .limit(10)
        .exec(
            (err, manuals) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se encontrarón resultados',
                        errors: err,
                        user: req.user
                    });
                } else {
                    ManualHist.find()
                        .or([{ 'name': regex }, { 'description': regex }])
                        .count({}, (err, totalRecords) => {
                            res.status(200).write(JSON.stringify({
                                success: true,
                                manuals: manuals,
                                totalRecords: manuals.length,
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

    ManualHist.find({ '_id': id })
        .populate('category')
        .populate('user')
        .exec(
            (id, (err, manual) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se puede actualizar el manual',
                        errors: err,
                        user: req.user
                    });
                }
                if (!manual) {
                    res.status(400).json({
                        success: false,
                        message: 'No existe un manual con el id: ' + id,
                        errors: { message: 'No se pudo encontrar un manual' },
                        user: req.user
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        manual: manual,
                        user: req.user
                    });
                }
            })
        )
});

router.delete('/:id', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {

    let id = req.params.id;

    ManualHist.findByIdAndRemove(id, (err, manualRemove) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede eliminar el manual',
                errors: err,
                user: req.user
            });
        } else if (manualRemove) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                manual: manualRemove,
                user: req.user
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No existe un manual con el id: ' + id,
                errors: { message: 'No se pudo encontrar el manual para eliminar' },
                user: req.user
            });
        }
    })
});

module.exports = router;