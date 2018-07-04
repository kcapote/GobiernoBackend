const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');

const Stats = require('../models/stats');

router.get('/', (req, res, next) => {
    
    Stats.find()
        .exec(
            (err, stats) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las Estadísticas',
                        errors: err,
                        user: req.user
                    });
                } else {

                    Stats.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            stats: stats,
                            user: req.user
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.post('/', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {
    let stat = new Stats({
        page: req.body.page,
        visit: req.body.visit
    });
    stat.save((err, statSave) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: 'No se puede crear la Estadística',
                errors: err,
                user: req.user
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                statSave: statSave,
                user: req.user
            });
        }
    });
});

router.put('/:id', [authentication.verifyToken, authentication.refreshToken], (req, res, next) => {

    let id = req.params.id;

    Stats.findById(id, (err, stat) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'No se puede actualizar la Estadística',
                errors: err,
                user: req.user
            });
        }

        if (!stat) {
            res.status(400).json({
                success: false,
                message: 'No existe una Estadísticas con el id: ' + id,
                errors: { message: 'No se pudo encontrar la Estadística para actualizar' },
                user: req.user
            });
        } else {
            stat.page =  stat.page;
            stat.visit = stat.visit+1;

            stat.save((err, stat) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la Estadística',
                        errors: err,
                        user: req.user
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        stat: stat,
                        user: req.user
                    });
                }
            });

        }
    })
});


module.exports = router;