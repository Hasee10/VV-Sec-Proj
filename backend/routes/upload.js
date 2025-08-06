const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const prisma = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = 'uploads/';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpeg,jpg,png,gif,pdf,doc,docx').split(',');
    const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
    
    if (allowedTypes.includes(fileExt)) {
      return cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
    }
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Save file info to database
    const fileRecord = await prisma.fileUpload.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`,
        uploadedBy: req.user.id
      }
    });

    logger.info(`File uploaded: ${req.file.originalname} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        originalName: fileRecord.originalName,
        url: fileRecord.url,
        size: fileRecord.size
      }
    });

  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const fileRecords = await Promise.all(
      req.files.map(file => 
        prisma.fileUpload.create({
          data: {
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            url: `/uploads/${file.filename}`,
            uploadedBy: req.user.id
          }
        })
      )
    );

    logger.info(`${req.files.length} files uploaded by user ${req.user.id}`);

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: fileRecords.map(record => ({
        id: record.id,
        filename: record.filename,
        originalName: record.originalName,
        url: record.url,
        size: record.size
      }))
    });

  } catch (error) {
    logger.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const fileRecord = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file or is admin
    if (fileRecord.uploadedBy !== req.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(fileRecord.path);
    } catch (fsError) {
      logger.warn(`Failed to delete file from filesystem: ${fileRecord.path}`, fsError);
    }

    // Delete record from database
    await prisma.fileUpload.delete({
      where: { id }
    });

    logger.info(`File deleted: ${fileRecord.filename} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    logger.error('File delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

module.exports = router;