const express = require('express');
const router = express.Router();

const Norma = require('../models/norma');

router.get('/', (req, res) => {

    let paginacion = req.query.paginacion || 0;
    paginacion = Number(paginacion);

    Norma.find()
        .skip(paginacion)
        .limit(10)
        .exec(
            (err, normas) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Norma',
                        errors: err
                    });
                } else {

                    Norma.count({}, (err, totalRegistros) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            normas: normas,
                            totalRegistros: totalRegistros,
                            paginacion: paginacion
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    var regex = new RegExp(termino, 'i');

    let paginacion = req.query.paginacion || 0;
    paginacion = Number(paginacion);

    Norma.find()
        .or([{ 'name': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(paginacion)
        .limit(10)
        .exec(
            (err, normas) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se encontrarón resultados',
                        errors: err
                    });
                } else {

                    Norma.count({}, (err, totalRegistros) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            normas: normas,
                            totalRegistros: totalRegistros,
                            paginacion: paginacion
                        }, null, 2));
                        res.end();

                    });
                }
            });
});


router.post('/', (req, res, next) => {
    let norma = new Norma({
        name: req.body.name,
        description: req.body.description,
        version: req.body.version,
        publicationDate: req.body.publicationDate,
        linkFile: req.body.linkFile,
        idFile: req.body.idFile
    });
    Norma.save((err, normaSave) => {
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
                norma: normaSave
            });
        }
    });
});

router.put('/:id', (req, res, next) => {

    let id = req.params.id;

    Norma.findById(id, (err, norma) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Norma',
                errors: err
            });
        }

        if (!norma) {
            res.status(400).json({
                success: false,
                message: 'No existe una Norma con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Norma para actualizar' }
            });
        } else {

            norma.name = req.body.name;
            norma.description = req.body.description;
            norma.version = req.body.version;
            norma.publicationDate = req.body.publicationDate;
            norma.linkFile = req.body.linkFile;
            norma.idFile = req.body.idFile

            norma.save((err, normaSave) => {
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
                        norma: normaSave
                    });
                }
            });

        }
    })
});


router.delete('/:id', (req, res, next) => {

    let id = req.params.id;

    Norma.findByIdAndRemove(id, (err, normaRemove) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede eliminar la Norma',
                errors: err
            });
        } else if (normaRemove) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                norma: normaRemove
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