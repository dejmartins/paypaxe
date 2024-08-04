import FinancialGoalModel from "../../financialGoal/model/financialGoal.model";
import { sendEmailNotification } from "../email/services/email.service";

export async function checkGoalsForNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for comparison

    const goals = await FinancialGoalModel.find({
        $or: [
            { deadline: { $gte: today } },
            { $expr: { $gte: ['$currentProgress', '$targetAmount'] } }
        ]
    }).populate({
        path: 'account',
        populate: {
            path: 'user',
            model: 'User'
        }
    }).lean();

    for (const goal of goals) {
        const goalDeadline = new Date(goal.deadline);
        goalDeadline.setHours(0, 0, 0, 0); // Reset time part for comparison
        if (goalDeadline.getTime() === today.getTime()) {
            await sendGoalDeadlineNotification(goal);
        } else if (goal.currentProgress >= goal.targetAmount) {
            await sendGoalAchievedNotification(goal);
        }
    }
}

async function sendGoalDeadlineNotification(goal: any) {
    const userEmail = goal.account.user.email;
    const subject = 'Goal Deadline Reminder';
    const message = `Your goal "${goal.title}" has a deadline today. Please review your progress.`;
    
    await sendEmailNotification(userEmail, subject, message);
}

async function sendGoalAchievedNotification(goal: any) {
    const userEmail = goal.account.user.email;
    const subject = 'Congratulations! Goal Achieved';
    const message = `Congratulations! You have achieved your goal "${goal.title}". Keep up the great work!`;
    
    await sendEmailNotification(userEmail, subject, message);
}
