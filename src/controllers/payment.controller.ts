import { Request, Response } from "express";
import Transaction from "../models/transaction.model";

class PaymentController {
  public static async getBalance(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const user = req.user;

      return res.status(200).json({
        message: "Get balance successful!",
        balance: user?.balance,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Getting balance failed!",
      });
    }

  }

  public static async deposit(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const { amount } = req.body;
      const user = req.user

      // Validate deposit amount
      if (amount <= 0) {
        return res.status(400).json({
          message: "Deposit amount must be greater than zero!",
        });
      }
      if (user) user.balance += Number(amount);
      await user?.save();

      // Record the transaction
      await Transaction.create({
        userId: user?._id,
        type: "deposit",
        amount,
        date: new Date(),
      });

      return res.status(200).json({
        message: "Deposit successful!",
        balance: user?.balance,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Deposit failed!",
      });
    }
  }

  public static async withdrawl(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const { amount } = req.body;
      const user = req.user;

      // Validate withdrawal amount
      if (amount <= 0) {
        return res.status(400).json({
          message: "Withdrawal amount must be greater than zero!",
        });
      }

      // Check if the user has sufficient balance
      if (user && user.balance < amount) {
        return res.status(400).json({
          message: "Insufficient balance!",
        });
      }

      // Update user's balance
      if (user) user.balance -= Number(amount);
      await user?.save();

      // Record the transaction
      await Transaction.create({
        userId: user?._id,
        type: "withdrawl",
        amount,
        date: new Date(),
      });

      return res.status(200).json({
        message: "Withdrawal successful!",
        balance: user?.balance,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Withdrawl failed",
      });
    }
  }
  public static async getTransactions(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Fetch transactions for the user
      const transactions = await Transaction.find({ userId }).sort({ date: -1 });

      return res.status(200).json({
        transactions: transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ error: "An error occurred while fetching transactions" });
    }
  }
}

export default PaymentController;
