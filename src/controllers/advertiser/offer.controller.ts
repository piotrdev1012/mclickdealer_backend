import { Request, Response } from "express";
import Offer, { IOfferDocument } from "../../models/offer.model";

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

      const myId = req.user?.id

      // Initialize the query object
      let query: any = { advertiserId: myId };

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
        status: 1,
        offers: offers,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Offers not found!",
      });
    }
  }

  public static async createOffer(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      console.log("### request => ", req.body)

      req.body.status = "active";
      //@ts-ignore
      req.body.imageUrl = req.file?.path.replace(/\\/g, '/') || "default.jpg"

      const offerData = {};

      for (const [key, value] of Object.entries(req.body)) {
        try {
          // Parse each JSON string back to its original type
          //@ts-ignore
          offerData[key] = JSON.parse(value);
        } catch (e) {
          //@ts-ignore
          offerData[key] = value; // If parsing fails, keep the raw value
        }
      }

      console.log('offerData ==> ', offerData);

      const newOffer: IOfferDocument = await Offer.create(offerData);
      return res.status(200).json({
        message: "Offer created successfully",
        offer: newOffer,
      });
    } catch (error) {
      return res.status(404).json({
        message: error,
        // message: "Offer creation failed!",
      });
    }
  }
  public static async updateOffer(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const isOffer = await Offer.findOne({ _id: req.body._id });
      if (isOffer) {
        Object.assign(isOffer, req.body.data);
        const updatedOffer = await isOffer.save();
        return res.status(200).json({
          message: "Offer updated successfully",
          offer: updatedOffer,
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: "Update failed!",
      });
    }
  }
  public static async deleteOffer(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    console.log("### request => ", req.body.id)
    try {

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          message: "Offer ID is required",
        });
      }

      const updatedOffer = await Offer.findByIdAndUpdate(
        { _id: id }, // Match the offer by ID
        { status: "closed" }, // Update the status to "closed"
        { new: true } // Return the updated document
      );

      if (!updatedOffer) {
        return res.status(404).json({
          message: "Offer not found",
        });
      }

      return res.status(200).json({
        message: "Offer deleted successfully",
        offer: req.body,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while updating the offer status",
        error,
      });
    }
  }
}
export default OfferController;
