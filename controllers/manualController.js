const express = require('express');
const router = express.Router();

const Manual = require('../models/manual');
const ManualHist = require('../models/manualHist');
const authentication = require('../middlewares/authentication');


router.get('/', (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Manual.find({}, 'name description version creationDate updateDate category user linkFile ')
        .populate('category')
        .populate('user')
        .skip(pagination)
        .limit(10)
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
                    Manual.count({}, (err, totalRecords) => {
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

router.get('/file/:idManual', (req, res, next) => {

    let idManual = req.params.idManual;

    Manual.find({ '_id': idManual }, 'file')
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

    Manual.find({},'name description version creationDate updateDate category user linkFile ')
        .populate('category')
        .populate('user')
        .limit(3)
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
                    Manual.count({}, (err, totalRecords) => {
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

    Manual.find({},'name description version creationDate updateDate category user linkFile ')
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
                    Manual.find()
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

    Manual.find({ '_id': id })
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


router.post('/', (req, res, next) => {
    let manual = new Manual({
        name: req.body.name,
        description: req.body.description,
        version: req.body.version,
        creationDate: new Date(),
        updateDate: new Date(),
        category: req.body.category,
        user: req.body.user,
        file: req.body.file,

        linkFile: req.body.linkFile
    });
    console.log(manual);

    manual.save((err, manual) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear el manual',
                errors: err,
                user: req.user
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                manual: manual,
                user: req.user
            });
        }
    });
});

router.put('/:id', (req, res, next) => {

    let id = req.params.id;

    Manual.findById(id, (err, manual) => {
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
                errors: { message: 'No se pudo encontrar un manual para actualizar' },
                user: req.user
            });
        } else {

            let manualHist = new ManualHist({
                idOrigin: manual._id,
                name: manual.name,
                description: manual.description,
                version: manual.version,
                creationDate: manual.creationDate,
                updateDate: manual.updateDate,
                category: manual.category,
                user: manual.user,
                file: manual.file,
                linkFile: manual.linkFile
            });
            manualHist.save((err, manualHist) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede respaldar el manual',
                        errors: err,
                        user: req.user
                    });
                } else {
                    //console.log(manualHist);
                }
            });

            manual.name = req.body.name;
            manual.description = req.body.description;
            manual.version = String(Number(manual.version) + 1);
            manual.updateDate = new Date();
            manual.category = req.body.category;
            manual.user = req.body.user;
            manual.file = req.body.file || manual.file;
            manual.linkFile = req.body.linkFile;

            manual.save((err, manualSave) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar el manual',
                        errors: err,
                        user: req.user
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        manual: manualSave,
                        user: req.user
                    });
                }
            });

        }
    })
});


router.delete('/:id', (req, res, next) => {

    let id = req.params.id;

    Manual.findByIdAndRemove(id, (err, manualRemove) => {
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