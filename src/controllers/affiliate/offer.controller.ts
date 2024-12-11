import { Request, Response } from "express";
import Offer from "../../models/offer.model";

class OfferController {
  public static async getFilteredOffer(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const {
        countries, // List of countries to filter by
        platforms, // List of platforms to filter by
        priceFormats, // Price format filter
        verticals, // Vertical filter
        myVerticalsOnly, // Flag to filter offers by vertical
        showInactive, // Flag to include/exclude inactive offers
      } = req.body;

      console.log('req.body =>', req.body);

      // Initialize the query object
      let query: any = {};

      // Filter by allowedCountries
      if (countries && Array.isArray(countries) && countries.length > 0) {
        query.allowedCountries = { $in: countries }; // Match any country in the array
      }

      // Filter by platforms
      if (platforms && Array.isArray(platforms) && platforms.length > 0) {
        query.platforms = { $in: platforms }; // Match any platform in the array
      }

      // Filter by priceFormat (if present)
      if (priceFormats && Array.isArray(priceFormats) && priceFormats.length > 0) {
        query.priceFormat = { $in: priceFormats }; // Match any price format in the array
      }

      // Filter by vertical
      if (verticals && Array.isArray(verticals) && verticals.length > 0) {
        query.vertical = { $in: verticals }; // Match any vertical in the array
      }

      // // Filter by myVerticalsOnly flag
      // if (myVerticalsOnly === 'true') {
      //   query.vertical = { $exists: true, $ne: '' }; // Only return offers with a vertical
      // }

      // // Filter by showInactive flag (assuming status is the field that indicates active/inactive)
      // if (showInactive === 'true') {
      //   query.status = { $ne: 'inactive' }; // Exclude offers with status 'inactive'
      // }

      // Fetch the filtered offers from the database
      const offers = await Offer.find(query);

      // Return the filtered offers in the response
      return res.status(200).json({
        offers: offers,
      });
      } catch (error) {
      return res.status(404).json({
        message: "Offers not found!",
      });
    }
  }
}
export default OfferController;
