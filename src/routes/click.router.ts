// click.routes.ts
import express from 'express';
import { trackClick, getClickData , trackConversion, getConversionData, approveRejectClick} from '../controllers/click.controller';

const router = express.Router();


router.post('/track-click', (req, res) => {
    console.log('Track Click Route Hit');
    trackClick(req, res);
  });
router.post('/track-conversion', (req, res) => {
    console.log('Track Conversion Route Hit');
    trackConversion(req, res);
  });
router.get('/get', getClickData);
router.get('/get-conversion', getConversionData);
router.post('/approve-reject-click', approveRejectClick);

export default router;
