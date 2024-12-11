import path from "path";
import express, { Application, Request, Response } from "express";
import authRoutes from "./auth/auth.router";

import advertiserOfferRoute from "./advertiser/offer.router";
import affiliateOfferRoute from "./affiliate/offer.router";

import advertiserCampaignRoute from "./advertiser/campaign.router";
import affiliateCampaignRoute from "./affiliate/campaign.router";

import tokenRoutes from "./token.router";

import trackingLinkRoutes from './trackingLink.router';

import clickRoutes from './click.router';

import paymentRoutes from './payment.router';

export default function routes(app: Application): void {
  app.use("/api/auth", authRoutes);

  app.use("/api/advertiser/offer", advertiserOfferRoute);
  app.use("/api/affiliate/offer", affiliateOfferRoute);

  app.use("/api/advertiser/campaign", advertiserCampaignRoute);
  app.use("/api/affiliate/campaign", affiliateCampaignRoute);

  app.use("/api/tokens", tokenRoutes);

  app.use("/api/tracking-links", trackingLinkRoutes);

  app.use('/api/clicks', clickRoutes);

  app.use('/api/payment', paymentRoutes);
}
