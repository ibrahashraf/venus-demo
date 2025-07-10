import mongoose, { Schema, model, models } from 'mongoose';

const PromotionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },

    requiresCode: { type: Boolean, required: true, default: false },

    code: { type: String, unique: true, sparse: true, uppercase: true, trim: true, },
    codeUsageLimit: { type: Number, default: 0 },
    codeUsageCount: { type: Number, default: 0 },

    promotionType: {
        type: String,
        enum: [ 'auto', 'minSubtotal', 'minQuantity', 'bogo' ],
        default: 'auto',
        required: true,
    },
    // subtotal
    minSubtotal: { type: Number },
    // quantity
    minQuantity: { type: Number },
    // bogo
    buyQty: { type: Number },
    getQty: { type: Number },
    buyProducts: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    getProducts: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    // all except bogo
    appliesTo: {
        type: String,
        enum: ['all', 'products', 'categories'],
        default: 'all',
    },
    products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'freeItem'],
    },
    discountValue: { type: Number },


    // all
    startsAt: { type: Date },
    endsAt: { type: Date },
    isActive: { type: Boolean, default: true },

}, { timestamps: true });

export const Promotion = models?.Promotion || model('Promotion', PromotionSchema);
