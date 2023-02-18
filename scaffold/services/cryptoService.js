const Crypto = require('../models/Crypto');

exports.getAll = () => Crypto.find({}).lean();

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).lean();

exports.search = async (name, paymentMethod) => {
    let crypto = await this.getAll();

    if (name) {
        crypto = crypto.filter(x => x.name.toLowerCase() == name.toLowerCase());
    }

    if (paymentMethod) {
        crypto = crypto.filter(x => x.paymentMethod.toLowerCase() == paymentMethod);
    }

    return crypto;
};

// Database filtration
// exports.searchDb = async (name, paymentMethod) => {
//     Crypto.find({
//         name: {$regex: new RegExp(name, 'ig')}, 
//     });
// };

exports.buy = async (userId, cryptoId) => {
    const crypto = await Crypto.findById(cryptoId);

    crypto.buyers.push(userId);

    return crypto.save();
};
// Crypto.findByIdAndUpdate(cryptoId, {$push: {buyers: userId}})

exports.create = (ownerId, cryptoData) => Crypto.create({ ...cryptoData, owner: ownerId });

exports.edit = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true });

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);