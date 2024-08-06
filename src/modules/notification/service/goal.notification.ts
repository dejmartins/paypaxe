import FinancialGoalModel from "../../financialGoal/model/financialGoal.model";
import { updateFinancialGoal } from "../../financialGoal/service/financialGoal.service";
import { sendEmailNotification } from "../email/services/email.service";

export async function checkGoalsForNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goals = await FinancialGoalModel.find({
        $or: [
            { deadline: { $lte: today }, deadlineNotificationSent: false },
            { $expr: { $gte: ['$currentProgress', '$targetAmount'] }, goalAchievedNotificationSent: false }
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
        goalDeadline.setHours(0, 0, 0, 0);
        if (goalDeadline.getTime() === today.getTime() && !goal.deadlineNotificationSent) {
            await sendGoalDeadlineNotification(goal);
            await updateFinancialGoal(goal._id.toString(), { deadlineNotificationSent: true });
        } else if (goal.currentProgress >= goal.targetAmount && !goal.goalAchievedNotificationSent) {
            await sendGoalAchievedNotification(goal);
            await updateFinancialGoal(goal._id.toString(), { goalAchievedNotificationSent: true });
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
