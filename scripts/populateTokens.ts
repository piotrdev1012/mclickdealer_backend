import mongoose from "mongoose";
// import Token from "./models/token.model";
import Token from '../src/models/token.model';

const populateTokens = async () => {
  const tokens = [
    { tokenName: "Lead ID", placeholder: "#leadid#" },
    { tokenName: "Affiliate ID", placeholder: "#affid#" },
    { tokenName: "Offer ID", placeholder: "#oid#" },
    { tokenName: "Campaign ID", placeholder: "#campid#" },
    { tokenName: "Creative ID", placeholder: "#cid#" },
    { tokenName: "Transaction ID", placeholder: "#tid#" },
    { tokenName: "Sub ID 1", placeholder: "#s1#" },
    { tokenName: "Sub ID 2", placeholder: "#s2#" },
    { tokenName: "Sub ID 3", placeholder: "#s3#" },
    { tokenName: "Sub ID 4", placeholder: "#s4#" },
    { tokenName: "Sub ID 5", placeholder: "#s5#" },
    { tokenName: "Payout", placeholder: "#price#" },
    { tokenName: "UDID", placeholder: "#udid#" },
    { tokenName: "Currency", placeholder: "#currency#" },
    { tokenName: "Price in USD", placeholder: "#price_usd#" },
    { tokenName: "Disposition Type", placeholder: "#disposition#" },
    { tokenName: "Conversion Unix Timestamp", placeholder: "#utcunixtime#" },
    { tokenName: "Conversion Datetime", placeholder: "#sourcedate#" },
    { tokenName: "Facebook Click Identifier", placeholder: "#fbclid#" },
    { tokenName: "TikTok Click Identifier", placeholder: "#ttclid#" },
    { tokenName: "Google Click Identifier", placeholder: "#gclid#" },
    { tokenName: "External Click Identifier", placeholder: "#xclid#" },
    { tokenName: "Action Type", placeholder: "#action_type#" },
    { tokenName: "External Affiliate ID", placeholder: "#ext_affid#" },
    { tokenName: "External Advertiser ID", placeholder: "#ext_advid#" },
    { tokenName: "External Offer ID", placeholder: "#ext_oid#" },
    { tokenName: "External Creative ID", placeholder: "#ext_cid#" },
    { tokenName: "External Campaign ID", placeholder: "#ext_campid#" },
    { tokenName: "External Offer Contract ID", placeholder: "#ext_ocid#" },
  ];

  try {
    await mongoose.connect("mongodb://localhost:27017/affiliate");
    await Token.deleteMany();
    await Token.insertMany(tokens);
    console.log("Tokens populated successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error populating tokens:", error);
    process.exit(1);
  }
};

export default populateTokens();
