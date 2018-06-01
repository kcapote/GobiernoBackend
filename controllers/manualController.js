const express = require('express');
const router = express.Router();

const Manual = require('../models/manual');
const ManualHist = require('../models/manualHist');


router.get('/', (req, res) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Manual.find()
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
                        errors: err
                    });
                } else {
                    Manual.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            manuals: manuals,
                            totalRecords: manuals.length,
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

    Manual.find()
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
                        errors: err
                    });
                } else {

                    Manual.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            manuals: manuals,
                            totalRecords: manuals.length,
                            pagination: pagination
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
                        errors: err
                    });
                }
                if (!manual) {
                    res.status(400).json({
                        success: false,
                        message: 'No existe un manual con el id: ' + id,
                        errors: { message: 'No se pudo encontrar un manual' }
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        manual: manual
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
    manual.save((err, manual) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear el manual',
                errors: err
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                manual: manual
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
                errors: err
            });
        }

        if (!manual) {
            res.status(400).json({
                success: false,
                message: 'No existe un manual con el id: ' + id,
                errors: { message: 'No se pudo encontrar un manual para actualizar' }
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
                        errors: err
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
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        manual: manualSave
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
                errors: err
            });
        } else if (manualRemove) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                manual: manualRemove
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No existe un manual con el id: ' + id,
                errors: { message: 'No se pudo encontrar el manual para eliminar' }
            });
        }
    })
});

module.exports = router;