import { Schema, model, Document } from 'mongoose';

export interface IActivityLog extends Document {
    entityType: 'financialGoal' | 'budget' | 'income' | 'expense';
    entityId: string;
    accountId: string;
    userId?: string;
    action: string;
    details: string;
    timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        entityType: { 
            type: String, 
            required: true 
        },
        entityId: { 
            type: String,
            required: true 
        },
        accountId: { 
            type: String,
            required: true 
        },
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },
        action: { 
            type: String, 
            required: true 
        },
        details: { 
            type: String 
        },
    },
    { 
        timestamps: true 
    }
);

const ActivityLogModel = model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLogModel;
