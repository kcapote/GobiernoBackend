const express = require('express');
const router = express.Router();

const Rule = require('../models/rule');

router.get('/', (req, res) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Rule.find()
        .skip(pagination)
        .limit(10)
        .exec(
            (err, rules) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Norma',
                        errors: err
                    });
                } else {

                    Rule.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            rules: rules,
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

    Rule.find()
        .or([{ 'name': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(pagination)
        .limit(10)
        .exec(
            (err, rules) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se encontrarón resultados',
                        errors: err
                    });
                } else {

                    Rule.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            rules: rules,
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});


router.post('/', (req, res, next) => {
    let rule = new Norma({
        name: req.body.name,
        description: req.body.description,
        version: req.body.version,
        publicationDate: req.body.publicationDate,
        linkFile: req.body.linkFile,
        idFile: req.body.idFile
    });
    rule.save((err, ruleSave) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear la Norma',
                errors: err
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                rule: ruleSave
            });
        }
    });
});

router.put('/:id', (req, res, next) => {

    let id = req.params.id;

    Rule.findById(id, (err, rule) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Norma',
                errors: err
            });
        }

        if (!rule) {
            res.status(400).json({
                success: false,
                message: 'No existe una Norma con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Norma para actualizar' }
            });
        } else {

            rule.name = req.body.name;
            rule.description = req.body.description;
            rule.version = req.body.version;
            rule.publicationDate = req.body.publicationDate;
            rule.linkFile = req.body.linkFile;
            rule.idFile = req.body.idFile

            rule.save((err, ruleSave) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la Norma',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        rule: ruleSave
                    });
                }
            });

        }
    })
});


router.delete('/:id', (req, res, next) => {

    let id = req.params.id;

    Rule.findByIdAndRemove(id, (err, ruleRemove) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede eliminar la Norma',
                errors: err
            });
        } else if (ruleRemove) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                rule: ruleRemove
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No existe una Norma con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Norma para eliminar' }
            });
        }
    })
});

module.exports = router;