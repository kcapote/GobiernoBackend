const express = require('express');
const router = express.Router();

const Manual = require('../models/manual');

router.get('/', (req, res) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Manual.find()
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

    Manual.find()
        .or([{ 'name': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
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
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});


router.post('/', (req, res, next) => {
    let manual = new Manual({
        name: req.body.name,
        description: req.body.description,
        version: req.body.version,
        publicationDate: req.body.publicationDate,
        linkFile: req.body.linkFile,
        idFile: req.body.idFile
    });
    Manual.save((err, manualSave) => {
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
                manual: manualSave
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

            manual.name = req.body.name;
            manual.description = req.body.description;
            manual.version = req.body.version;
            manual.publicationDate = req.body.publicationDate;
            manual.linkFile = req.body.linkFile;
            manual.idFile = req.body.idFile

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