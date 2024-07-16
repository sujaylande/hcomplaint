import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({

    id: mongoose.Schema.Types.ObjectId,

    name: { type: String,
     },

    block_no: { type: String,
     },

    roll_no: { type: String,
    },

    description: { type: String,
        required: true
     },

    room_no: { type: String,
     
     },

    is_completed: { type: Boolean,
        default: false
     },

    created_at: { type: Date },

    owner: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
     },

});

export const Complaint = mongoose.model('Complaint', complaintSchema);