const express = require('express');
const router = express.Router();

const Rule = require('../models/rule');
const RuleHist = require('../models/ruleHist');


router.get('/', (req, res) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Rule.find()
        .populate('category')
        .populate('user')
        .skip(pagination)
        .limit(10)
        .exec(
            (err, rules) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las normas',
                        errors: err
                    });
                } else {
                    Rule.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            rules: rules,
                            totalRecords: rules.length,
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
        .populate('category')
        .populate('user')
        .or([{ 'name': regex }, { 'description': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
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
                            totalRecords: rules.length,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});


router.get('/:id', (req, res, next) => {

    let id = req.params.id;

    Rule.find({ '_id': id })
        .populate('category')
        .populate('user')
        .exec(
            (id, (err, rule) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se puede actualizar la norma',
                        errors: err
                    });
                }
                if (!rule) {
                    res.status(400).json({
                        success: false,
                        message: 'No existe una norma con el id: ' + id,
                        errors: { message: 'No se pudo encontrar la norma' }
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        rule: rule
                    });
                }
            })
        )
});


router.post('/', (req, res, next) => {
    let rule = new Rule({
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
    rule.save((err, rule) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear la norma',
                errors: err
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                rule: rule
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
                message: 'No se puede actualizar la norma',
                errors: err
            });
        }

        if (!rule) {
            res.status(400).json({
                success: false,
                message: 'No existe una norma con el id: ' + id,
                errors: { message: 'No se pudo encontrar la norma para actualizar' }
            });
        } else {

            let ruleHist = new RuleHist({
                idOrigin: rule._id,
                name: rule.name,
                description: rule.description,
                version: rule.version,
                creationDate: rule.creationDate,
                updateDate: rule.updateDate,
                category: rule.category,
                user: rule.user,
                file: rule.file,
                linkFile: rule.linkFile
            });
            ruleHist.save((err, ruleHist) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede respaldar la norma',
                        errors: err
                    });
                } else {
                    //console.log(ruleHist);
                }
            });

            rule.name = req.body.name;
            rule.description = req.body.description;
            rule.version = String(Number(rule.version) + 1);
            rule.updateDate = new Date();
            rule.category = req.body.category;
            rule.user = req.body.user;
            rule.file = req.body.file || rule.file;
            rule.linkFile = req.body.linkFile;

            rule.save((err, ruleSave) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la norma',
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
                message: 'No se puede eliminar el rule',
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
                message: 'No existe un rule con el id: ' + id,
                errors: { message: 'No se pudo encontrar el rule para eliminar' }
            });
        }
    })
});

module.exports = router;