import logger from '../logs/logger.js';

export default function errorHandler(err, req, res, next) {
    console.log('error nombre:', err.name);
    logger.error(err.message);

    if (err.name === 'ValidationError') {
        return res.status(400).json({message: err.message});
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({message: err.message});
    } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({message: err.message});
    } else if (err.name === 'SequelizeUniqueConstraintError' || 
               err.name === 'SequelizeValidationError' || 
               err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({message: err.message});
    } else {
        return res.status(500).json({message: err.message});
    }
  
}