import { Router } from 'express';
import authRoutes from './auth.routes';
import farmerRoutes from './farmer.routes';
import cropRoutes from './crop.routes';
import weatherRoutes from './weather.routes';
import soilRoutes from './soil.routes';
import labourRoutes from './labour.routes';
import machineryRoutes from './machinery.routes';
import marketplaceRoutes from './marketplace.routes';
import aiRoutes from './ai.routes';
import bookingRoutes from './booking.routes';
import orderRoutes from './order.routes';
import notificationRoutes from './notification.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/farmers', farmerRoutes);
apiRouter.use('/crops', cropRoutes);
apiRouter.use('/weather', weatherRoutes);
apiRouter.use('/soil', soilRoutes);
apiRouter.use('/labour', labourRoutes);
apiRouter.use('/machinery', machineryRoutes);
apiRouter.use('/marketplace', marketplaceRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/notifications', notificationRoutes);

export default apiRouter;
