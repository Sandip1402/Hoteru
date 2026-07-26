import express from 'express'
const router = express.Router();
import { attachUserPayload, checkJwt, requireRole } from '../auth/middlewares.js';


export default function (prisma) {

    // api for users to request account upgrade to host
    router.post('/', checkJwt, attachUserPayload, requireRole('basic_user'), async (req, res) => {
        const { phoneNumber, governmentIdUrl, businessName } = req.body;
        const userId = req.user.userId;

        try {
            // prevent duplicate request
            // fix : add hostRequest table
            const existingRequest = await prisma.hostRequest.findFirst({
                where: { userId, status: 'PENDING' }
            });

            if (existingRequest) {
                return res.status(400).json({ success: false, message: 'You already have a pending request.' });
            }

            // save request details
            const newRequest = await prisma.hostRequest.create({
                data: {
                    userId,
                    phoneNumber,
                    governmentIdUrl,
                    businessName
                }
            });

            res.status(201).json({ success: true, message: 'Request submitted successfully to verify', newRequest });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Host request failed!' })
            console.error(error);
        }
    })


    // api for admins to accept or reject host upgradation request
    router.patch('/:id/admin', checkJwt, attachUserPayload, requireRole('admin'), async (req, res) => {
        const requestId = parseInt(req.params.id);
        const { action, adminNotes } = req.body; // action - 'APPROVE' or 'REJECT'

        if (!['APPROVE', 'REJECT'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }

        try {
            // find target request
            const hostRequest = await prisma.hostRequest.findUnique({
                where: { id: requestId }
            });

            if (!hostRequest) {
                return res.status(404).json({ success: false, message: 'Host request not found' });
            }

            if (hostRequest.status !== 'PENDING') {
                return res.status(400).json({ success: false, message: 'Request already processed' });
            }

            // handle approval or rejection using prisma transaction
            const result = await prisma.$transaction(async (tx) => {
                const finalStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

                // update request status
                const updatedRequest = await tx.hostRequest.update({
                    where: { id: requestId },
                    data: { status: finalStatus, adminNotes }
                });

                // If approved, elevate the user to HOST in DB
                if (action === 'APPROVE') {
                    await tx.user.update({
                        where: { id: hostRequest.userId },
                        data: { role: 'HOST' }
                    });
                }

                return updatedRequest;
            });

            if (action === 'APPROVE') {
                await assignHostRoleInAuth0(hostRequest.userId);
            }

            res.json({ message: `Request successfully ${action.toLowerCase()}d.`, result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    });

    return router;
};